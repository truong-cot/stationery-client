'use client';

import {pdf} from '@react-pdf/renderer';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AddCircle, CloseCircle, Edit, Printer, TickCircle, Trash, Verify, Warning2} from 'iconsax-reactjs';
import {Eye} from 'iconsax-react';
import moment from 'moment';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ChangeEvent, Fragment, useCallback, useMemo, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import FilterCustom from '~/components/common/FilterCustom';
import FilterDateRange from '~/components/common/FilterDateRange';
import Loading from '~/components/common/Loading';
import Pagination from '~/components/common/Pagination';
import PositionContainer from '~/components/common/PositionContainer';
import Table from '~/components/common/Table';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import DataWrapper from '~/components/utils/DataWrapper';
import HeaderActions from '~/components/utils/HeaderActions';
import IconActionTable from '~/components/utils/IconActionTable';
import MainTable from '~/components/utils/MainTable';
import SearchBlock from '~/components/utils/SearchBlock';
import StateActive from '~/components/utils/StateActive';
import {QUERY_KEY, TYPE_DATE} from '~/constants/config/enum';
import {getNextOrderStatusOptions, listOptionOrderStatus, listStateOrder, ORDER_STATUS} from '~/constants/config/order';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import contactServices from '~/services/contact.service';
import orderServices from '~/services/order.service';
import DetailOrder from '../DetailOrder';
import {IOrderDetail} from '../DetailOrder/interfaces';
import FormCreateOrder from '../FormCreateOrder';
import FormUpdateOrder from '../FormUpdateOrder';
import InvoicePDF from '../InvoicePDF';
import ModalPreviewInvoice from '../ModalPreviewInvoice';
import type {IOrderItemPageList, PropsMainOrder} from './interfaces';
import styles from './MainOrder.module.scss';

function MainOrder({}: PropsMainOrder) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate, _idDetail} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [orderStatus, setOrderStatus] = useState<string>('');

	// State cho bộ lọc thời gian FilterDateRange
	const [typeDate, setTypeDate] = useState<TYPE_DATE>(TYPE_DATE.ALL);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>({from: null, to: null});

	const fromDate = useMemo(() => {
		return date?.from ? moment(date.from).format('YYYY-MM-DD') : undefined;
	}, [date]);

	const toDate = useMemo(() => {
		return date?.to ? moment(date.to).format('YYYY-MM-DD') : undefined;
	}, [date]);

	const [idDelete, setIdDelete] = useState<string>('');
	const [dataSelecteds, setDataSelecteds] = useState<IOrderItemPageList[]>([]);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [previewInvoice, setPreviewInvoice] = useState<{
		open: boolean;
		blobUrl: string | null;
		title: string;
		fileName: string;
	}>({
		open: false,
		blobUrl: null,
		title: '',
		fileName: '',
	});
	const [actionStatusConfirm, setActionStatusConfirm] = useState<{
		_id: string;
		code: string;
		targetStatus: ORDER_STATUS;
	} | null>(null);

	const {data: contactData} = useQuery({
		queryKey: ['contact-detail-store'],
		queryFn: () =>
			httpRequest({
				http: contactServices.detail(),
			}),
		staleTime: 60000,
	});

	const {
		data = {
			items: [],
			pagination: {
				currentPage: 0,
				totalCount: 0,
			},
		},
		isLoading,
	} = useQuery<{
		items: IOrderItemPageList[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListOrder, page, pageSize, keyword, orderStatus, fromDate, toDate],
		queryFn: () =>
			httpRequest({
				http: orderServices.getPageList({
					page,
					pageSize,
					keyword: keyword.trim() || undefined,
					order_status: orderStatus || undefined,
					from_date: fromDate,
					to_date: toDate,
				}),
			}),
		staleTime: 0,
	});

	// Xóa đơn hàng
	const funcDeleteOrder = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa đơn hàng thành công!',
				http: orderServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
		},
	});

	// Đổi trạng thái đơn hàng (Xác nhận, Giao thành công, Hủy)
	const funcUpdateStatus = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess:
					actionStatusConfirm?.targetStatus === ORDER_STATUS.COMPLETED
						? 'Xác nhận đơn hàng thành công!'
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? 'Đơn hàng giao thành công!'
							: 'Hủy đơn hàng thành công!',
				http: orderServices.updateStatus({
					_id: actionStatusConfirm?._id as string,
					order_status: actionStatusConfirm?.targetStatus as string,
				}),
			}),
		onSuccess: () => {
			setActionStatusConfirm(null);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
		},
	});

	const isDisableCheckBox = useCallback((row: IOrderItemPageList) => {
		return row.order_status === ORDER_STATUS.CANCELLED;
	}, []);

	const handleCheckedAll = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const {checked} = e.target;
			const items = data?.items || [];

			if (checked) {
				const validItems = items.filter((item) => !isDisableCheckBox(item));

				setDataSelecteds((prev) => {
					const map = new Map(prev.map((item) => [item._id, item]));
					validItems.forEach((item) => {
						map.set(item._id, item);
					});
					return Array.from(map.values());
				});
			} else {
				setDataSelecteds((prev) => prev.filter((item) => !items.some((v) => v._id === item._id)));
			}
		},
		[data?.items, isDisableCheckBox]
	);

	const isCheckedAll = useMemo(() => {
		const items = data?.items || [];
		const selectableItems = items.filter((item) => !isDisableCheckBox(item));

		if (selectableItems.length === 0) return false;

		return selectableItems.every((item) => dataSelecteds.some((v) => v._id === item._id));
	}, [data?.items, dataSelecteds, isDisableCheckBox]);

	const handleCheckedRow = (e: ChangeEvent<HTMLInputElement>, row: IOrderItemPageList) => {
		if (isDisableCheckBox(row)) return;

		const {checked} = e.target;
		if (checked) {
			setDataSelecteds((prev) => {
				if (prev.some((v) => v._id === row._id)) return prev;
				return [...prev, row];
			});
		} else {
			setDataSelecteds((prev) => prev.filter((v) => v._id !== row._id));
		}
	};

	const handleIsCheckedRow = (row: IOrderItemPageList) => {
		return dataSelecteds?.some((v) => v?._id === row?._id);
	};

	// Xem trước / Xuất hóa đơn cho 1 đơn hàng
	const exportInvoiceOrder = async (orderId: string) => {
		try {
			setIsExporting(true);
			const order: IOrderDetail = await queryClient.fetchQuery({
				queryKey: [QUERY_KEY.detailOrder, orderId],
				queryFn: () =>
					httpRequest({
						http: orderServices.detail({_id: orderId}),
					}),
			});

			const blob = await pdf(
				<InvoicePDF
					order={order}
					storeInfo={{
						address: contactData?.address,
						phones: contactData?.phone,
					}}
				/>
			).toBlob();

			const url = URL.createObjectURL(blob);
			setPreviewInvoice({
				open: true,
				blobUrl: url,
				title: `Hóa đơn: ${order.code}`,
				fileName: `Hoa-don-${order.code}.pdf`,
			});
		} catch (error) {
			console.error('Lỗi khi xuất hóa đơn:', error);
		} finally {
			setIsExporting(false);
		}
	};

	// Xem trước / Xuất hóa đơn hàng loạt
	const exportMultipleInvoices = async () => {
		if (dataSelecteds.length === 0) return;

		try {
			setIsExporting(true);
			const orders: IOrderDetail[] = await Promise.all(
				dataSelecteds.map((item) =>
					queryClient.fetchQuery({
						queryKey: [QUERY_KEY.detailOrder, item._id],
						queryFn: () =>
							httpRequest({
								http: orderServices.detail({_id: item._id}),
							}),
					})
				)
			);

			const blob = await pdf(
				<InvoicePDF
					orders={orders}
					storeInfo={{
						address: contactData?.address,
						phones: contactData?.phone,
					}}
				/>
			).toBlob();

			const url = URL.createObjectURL(blob);
			setPreviewInvoice({
				open: true,
				blobUrl: url,
				title: `Hóa đơn (${orders.length} đơn hàng)`,
				fileName: `Hoa-don-hang-loat.pdf`,
			});
		} catch (error) {
			console.error('Lỗi khi in hóa đơn hàng loạt:', error);
		} finally {
			setIsExporting(false);
		}
	};

	const handleClosePreview = () => {
		if (previewInvoice.blobUrl) {
			URL.revokeObjectURL(previewInvoice.blobUrl);
		}
		setPreviewInvoice({
			open: false,
			blobUrl: null,
			title: '',
			fileName: '',
		});
	};

	const handleResetFilter = () => {
		setKeyword('');
		setOrderStatus('');
		setTypeDate(TYPE_DATE.ALL);
		setDate({from: null, to: null});
		setPage(1);
	};

	const hasFilter = !!keyword || !!orderStatus || typeDate !== TYPE_DATE.ALL;

	return (
		<Fragment>
			<Loading loading={funcDeleteOrder.isPending || funcUpdateStatus.isPending || isExporting} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách đơn hàng'
					actions={
						<FlexLayout row gap-8 wrap items-center>
							{dataSelecteds.length > 0 && (
								<div>
									<Button icon={<Printer size={18} />} p_8_24 rounded_40 white bold onClick={exportMultipleInvoices}>
										In hóa đơn ({dataSelecteds.length})
									</Button>
								</div>
							)}
							<div>
								<Button
									icon={<AddCircle />}
									p_8_24
									rounded_40
									bright-cyan
									bold
									onClick={() =>
										updateQueryParams(router, pathname, searchParams, {
											set: {
												_action: 'create',
											},
											options: {
												scroll: false,
											},
										})
									}
								>
									Thêm mới đơn hàng
								</Button>
							</div>
						</FlexLayout>
					}
				/>

				<SearchBlock
					keyword={keyword}
					setKeyword={setKeyword}
					placeholder='Tìm theo mã đơn, họ tên, số điện thoại người nhận...'
					action={
						<FlexLayout row gap-8 fit-height items-center>
							<FlexItem flex-1 overflow-y scrollbar>
								<FlexLayout row gap-8 items-center wrap>
									<FilterCustom
										name='Trạng thái'
										value={orderStatus}
										setValue={(val) => {
											setOrderStatus(val as string);
											setPage(1);
										}}
										listOption={listOptionOrderStatus}
									/>

									<FilterDateRange
										name='Thời gian'
										date={date}
										setDate={setDate}
										typeDate={typeDate}
										setTypeDate={(val) => {
											setTypeDate(val);
											setPage(1);
										}}
									/>

									{hasFilter && (
										<div className={styles.clearFilter} onClick={handleResetFilter}>
											Xóa bộ lọc
										</div>
									)}
								</FlexLayout>
							</FlexItem>
						</FlexLayout>
					}
				/>

				<FlexItem flex-1 overflow-x>
					<MainTable>
						<DataWrapper
							data={data?.items}
							loading={isLoading}
							title='Dữ liệu trống!'
							note='Danh sách đơn hàng hiện đang trống!'
						>
							<Table<IOrderItemPageList>
								rowKey={(row) => row._id}
								data={data?.items}
								fixedHeader={true}
								handleCheckedAll={handleCheckedAll}
								isCheckedAll={isCheckedAll}
								handleCheckedRow={handleCheckedRow}
								handleIsCheckedRow={handleIsCheckedRow}
								isDisableCheckBox={isDisableCheckBox}
								column={[
									{
										title: 'STT',
										checkBox: true,
										render: (_, index) => <>{index + 1 + (page - 1) * pageSize}</>,
									},
									{
										title: 'Mã đơn hàng',
										fixedLeft: true,
										render: (row) => (
											<span style={{fontWeight: 700, color: '#0070F4', letterSpacing: '0.5px'}}>{row?.code}</span>
										),
									},
									{
										title: 'Khách hàng',
										render: (row) => (
											<div>
												<p style={{fontWeight: 600, color: '#1e293b'}}>{row?.customer_name}</p>
												<p style={{fontSize: 12, color: '#64748b'}}>{row?.customer_phone}</p>
											</div>
										),
									},
									{
										title: 'Địa chỉ nhận hàng',
										render: (row) => (
											<span
												style={{
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													fontSize: 13,
												}}
												title={row?.shipping_address}
											>
												{row?.shipping_address}
											</span>
										),
									},
									{
										title: 'Số lượng SP',
										render: (row) => <p style={{fontWeight: 600, textAlign: 'center'}}>{row?.total_items || 0}</p>,
									},
									{
										title: 'Tổng tiền',
										render: (row) => (
											<span style={{fontWeight: 700, color: '#EE0033'}}>{convertCoin(row?.total_amount)}đ</span>
										),
									},
									{
										title: 'Trạng thái',
										render: (row) => <StateActive stateActive={row?.order_status} listState={listStateOrder} />,
									},
									{
										title: 'Ngày đặt',
										render: (row) => (
											<span style={{fontSize: 13, color: '#475569'}}>
												{row?.created_at ? moment(row.created_at).format('DD/MM/YYYY HH:mm') : '---'}
											</span>
										),
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (row) => {
											const isPending = row.order_status === ORDER_STATUS.PENDING;
											const isCompleted = row.order_status === ORDER_STATUS.COMPLETED;

											return (
												<FlexLayout row gap-4 items-center>
													<IconActionTable
														icon={<Eye color='#292D32' size={20} />}
														tooltip='Xem chi tiết đơn hàng'
														onClick={() =>
															updateQueryParams(router, pathname, searchParams, {
																set: {
																	_idDetail: row._id,
																},
																options: {
																	scroll: false,
																},
															})
														}
													/>
													{row.order_status !== ORDER_STATUS.CANCELLED && (
														<IconActionTable
															icon={<Printer color='#06aed4' size={20} />}
															tooltip='Xuất hóa đơn'
															onClick={() => exportInvoiceOrder(row._id)}
														/>
													)}
													{isPending && (
														<IconActionTable
															icon={<Edit color='#292D32' size={20} />}
															tooltip='Chỉnh sửa đơn hàng'
															onClick={() =>
																updateQueryParams(router, pathname, searchParams, {
																	set: {
																		_idUpdate: row._id,
																	},
																	options: {
																		scroll: false,
																	},
																})
															}
														/>
													)}
													{isPending && (
														<IconActionTable
															icon={<TickCircle color='#0070F4' size={20} />}
															tooltip='Xác nhận đơn hàng'
															onClick={() =>
																setActionStatusConfirm({
																	_id: row._id,
																	code: row.code,
																	targetStatus: ORDER_STATUS.COMPLETED,
																})
															}
														/>
													)}
													{isCompleted && (
														<IconActionTable
															icon={<Verify color='#16A34A' size={20} />}
															tooltip='Xác nhận giao thành công'
															onClick={() =>
																setActionStatusConfirm({
																	_id: row._id,
																	code: row.code,
																	targetStatus: ORDER_STATUS.SUCCESS,
																})
															}
														/>
													)}
													{(isPending || isCompleted) && (
														<IconActionTable
															icon={<CloseCircle color='#DC2626' size={20} />}
															tooltip='Hủy đơn hàng'
															onClick={() =>
																setActionStatusConfirm({
																	_id: row._id,
																	code: row.code,
																	targetStatus: ORDER_STATUS.CANCELLED,
																})
															}
														/>
													)}
													<IconActionTable
														icon={<Trash color='#EE0033' size={20} />}
														tooltip='Xóa đơn hàng'
														onClick={() => setIdDelete(row._id)}
													/>
												</FlexLayout>
											);
										},
									},
								]}
							/>
						</DataWrapper>

						<Pagination
							page={page}
							onSetPage={setPage}
							pageSize={pageSize}
							onSetPageSize={setPageSize}
							total={data?.pagination?.totalCount || 0}
							dependencies={[pageSize, keyword, orderStatus, fromDate, toDate]}
						/>
					</MainTable>
				</FlexItem>
			</FlexLayout>

			{/* PositionContainer cho Thêm mới đơn hàng */}
			<PositionContainer
				open={_action === 'create'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_action'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormCreateOrder
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_action'],
							options: {
								scroll: false,
							},
						})
					}
				/>
			</PositionContainer>

			{/* PositionContainer cho Chỉnh sửa đơn hàng */}
			<PositionContainer
				open={!!_idUpdate}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_idUpdate'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormUpdateOrder
					_idOrder={_idUpdate as string}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_idUpdate'],
							options: {
								scroll: false,
							},
						})
					}
				/>
			</PositionContainer>

			{/* PositionContainer cho Chi tiết đơn hàng */}
			<PositionContainer
				open={!!_idDetail}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_idDetail'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<DetailOrder
					_idOrder={_idDetail as string}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_idDetail'],
							options: {
								scroll: false,
							},
						})
					}
					onEdit={() =>
						updateQueryParams(router, pathname, searchParams, {
							set: {
								_idUpdate: _idDetail,
							},
							delete: ['_idDetail'],
							options: {
								scroll: false,
							},
						})
					}
				/>
			</PositionContainer>

			{/* Dialog Xác nhận xóa đơn hàng */}
			<Dialog
				open={!!idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa đơn hàng'
				note='Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Thao tác này không thể hoàn tác!'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteOrder.mutate}
			/>

			{/* Dialog Xác nhận chuyển trạng thái (Xác nhận / Hoàn tất / Hủy) */}
			<Dialog
				open={!!actionStatusConfirm}
				type={actionStatusConfirm?.targetStatus === ORDER_STATUS.CANCELLED ? 'error' : 'primary'}
				backgroundIconColor={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.CANCELLED
						? '#ffdce4'
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? '#dcfce7'
							: '#e0f2fe'
				}
				borderIconColor={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.CANCELLED
						? '#fff0f3'
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? '#f0fdf4'
							: '#f0f9ff'
				}
				title={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.COMPLETED
						? 'Xác nhận đơn hàng'
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? 'Giao hàng thành công'
							: 'Hủy đơn hàng'
				}
				note={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.COMPLETED
						? `Bạn có chắc chắn muốn xác nhận đơn hàng "${actionStatusConfirm?.code}" không? Đơn hàng sẽ được chuyển sang trạng thái ĐÃ XÁC NHẬN (COMPLETED).`
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? `Xác nhận đơn hàng "${actionStatusConfirm?.code}" đã được giao thành công đến tay khách hàng?`
							: `Bạn có chắc chắn muốn hủy đơn hàng "${actionStatusConfirm?.code}" không? Thao tác này không thể hoàn tác!`
				}
				titleSubmit={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.COMPLETED
						? 'Xác nhận'
						: actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS
							? 'Hoàn tất'
							: 'Hủy đơn'
				}
				icon={
					actionStatusConfirm?.targetStatus === ORDER_STATUS.COMPLETED ? (
						<TickCircle size='28' color='#0070F4' />
					) : actionStatusConfirm?.targetStatus === ORDER_STATUS.SUCCESS ? (
						<Verify size='28' color='#16A34A' />
					) : (
						<CloseCircle size='28' color='#DC2626' />
					)
				}
				onClose={() => setActionStatusConfirm(null)}
				onSubmit={funcUpdateStatus.mutate}
			/>

			{/* Modal Xem trước Hóa đơn PDF */}
			<ModalPreviewInvoice
				open={previewInvoice.open}
				blobUrl={previewInvoice.blobUrl}
				title={previewInvoice.title}
				fileName={previewInvoice.fileName}
				loading={isExporting}
				onClose={handleClosePreview}
			/>
		</Fragment>
	);
}

export default MainOrder;
