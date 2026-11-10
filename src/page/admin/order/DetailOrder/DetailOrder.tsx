'use client';

import {pdf} from '@react-pdf/renderer';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import clsx from 'clsx';
import {CloseCircle, TickCircle, Verify, Warning2} from 'iconsax-reactjs';
import moment from 'moment';
import Image from 'next/image';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import InfoDetail from '~/components/utils/InfoDetail';
import StateActive from '~/components/utils/StateActive';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {listStateOrder, ORDER_STATUS} from '~/constants/config/order';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import contactServices from '~/services/contact.service';
import orderServices from '~/services/order.service';
import InvoicePDF from '../InvoicePDF';
import ModalPreviewInvoice from '../ModalPreviewInvoice';
import type {IOrderDetail, PropsDetailOrder} from './interfaces';
import styles from './DetailOrder.module.scss';

function DetailOrder({_idOrder, onClose, onEdit}: PropsDetailOrder) {
	const queryClient = useQueryClient();

	const [openDelete, setOpenDelete] = useState<boolean>(false);
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

	const {data: order, isLoading} = useQuery<IOrderDetail>({
		queryKey: [QUERY_KEY.detailOrder, _idOrder],
		queryFn: () =>
			httpRequest({
				http: orderServices.detail({
					_id: _idOrder,
				}),
			}),
		enabled: !!_idOrder,
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
					_id: _idOrder,
				}),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
			setOpenDelete(false);
			onClose();
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
					_id: _idOrder,
					order_status: actionStatusConfirm?.targetStatus as string,
				}),
			}),
		onSuccess: () => {
			setActionStatusConfirm(null);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.detailOrder, _idOrder]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
		},
	});

	const isPending = order?.order_status === ORDER_STATUS.PENDING;
	const isCompleted = order?.order_status === ORDER_STATUS.COMPLETED;

	const exportInvoiceOrder = async () => {
		if (!order) return;
		try {
			setIsExporting(true);
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

	const getImageUrl = (image: string) => {
		if (!image) return '';
		if (image.startsWith('http://') || image.startsWith('https://')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<Fragment>
			<Loading loading={isLoading || funcDeleteOrder.isPending || funcUpdateStatus.isPending || isExporting} />
			<WrapperFormPostion
				width={780}
				title={`Chi tiết đơn hàng - ${order?.code || '---'}`}
				actions={
					<FlexLayout row items-center fit-height gap-8 wrap>
						{order?.order_status !== ORDER_STATUS.CANCELLED && (
							<div>
								<Button p_8_24 rounded_8 white bold onClick={exportInvoiceOrder}>
									Xuất hóa đơn
								</Button>
							</div>
						)}
						{isPending && (
							<div>
								<Button
									p_8_24
									rounded_8
									bright-cyan
									bold
									onClick={() =>
										setActionStatusConfirm({
											_id: _idOrder,
											code: order?.code || '',
											targetStatus: ORDER_STATUS.COMPLETED,
										})
									}
								>
									Xác nhận đơn
								</Button>
							</div>
						)}
						{isCompleted && (
							<div>
								<Button
									p_8_24
									rounded_8
									bright-cyan
									bold
									onClick={() =>
										setActionStatusConfirm({
											_id: _idOrder,
											code: order?.code || '',
											targetStatus: ORDER_STATUS.SUCCESS,
										})
									}
								>
									Giao thành công
								</Button>
							</div>
						)}
						{(isPending || isCompleted) && (
							<div>
								<Button
									p_8_24
									rounded_8
									red
									bold
									onClick={() =>
										setActionStatusConfirm({
											_id: _idOrder,
											code: order?.code || '',
											targetStatus: ORDER_STATUS.CANCELLED,
										})
									}
								>
									Hủy đơn
								</Button>
							</div>
						)}
						{isPending && onEdit && (
							<div>
								<Button p_8_24 rounded_8 white bold onClick={onEdit}>
									Chỉnh sửa
								</Button>
							</div>
						)}
						<div>
							<Button p_8_24 rounded_8 red bold onClick={() => setOpenDelete(true)}>
								Xóa
							</Button>
						</div>
						<div>
							<Button p_8_24 rounded_8 white bold onClick={onClose}>
								Đóng
							</Button>
						</div>
					</FlexLayout>
				}
			>
				<FlexLayout column gap-16>
					{/* Thông tin đơn hàng & Khách hàng */}
					<WrapperForm title='Thông tin đơn hàng & Khách hàng'>
						<FlexLayout column gap-12>
							<GridColumn col_2>
								<InfoDetail name='Mã đơn hàng' value={order?.code || '---'} />
								<InfoDetail name='Họ tên người nhận' value={order?.customer_name || '---'} />
								<InfoDetail name='Số điện thoại' value={order?.customer_phone || '---'} />
								<InfoDetail
									name='Trạng thái đơn hàng'
									value={<StateActive stateActive={order?.order_status || null} listState={listStateOrder} />}
								/>
							</GridColumn>
							<InfoDetail name='Địa chỉ nhận hàng' value={order?.shipping_address || '---'} />
							<InfoDetail name='Ghi chú khách hàng' value={order?.customer_note || '(Không có ghi chú)'} />
							<InfoDetail
								name='Thời gian tạo'
								value={order?.created_at ? moment(order.created_at).format('DD/MM/YYYY HH:mm:ss') : '---'}
							/>
						</FlexLayout>
					</WrapperForm>

					{/* Danh sách sản phẩm mua */}
					<WrapperForm title='Danh sách sản phẩm (Snapshot thời điểm đặt)'>
						<table className={styles.tableItems}>
							<thead>
								<tr>
									<th style={{width: 40, textAlign: 'center'}}>STT</th>
									<th>Sản phẩm</th>
									<th>Quy cách</th>
									<th style={{textAlign: 'right'}}>Đơn giá</th>
									<th style={{width: 80, textAlign: 'center'}}>SL</th>
									<th style={{textAlign: 'right'}}>Thành tiền</th>
								</tr>
							</thead>
							<tbody>
								{order?.items?.map((item, index) => {
									const imgUrl = getImageUrl(item.product_image);
									return (
										<tr key={index}>
											<td style={{textAlign: 'center'}}>{index + 1}</td>
											<td>
												<div className={styles.productCell}>
													<div className={styles.imageWrapper}>
														{imgUrl ? (
															<Image
																unoptimized
																src={imgUrl}
																alt={item.product_name}
																width={44}
																height={44}
															/>
														) : (
															<span style={{fontSize: 9, color: '#94a3b8'}}>No image</span>
														)}
													</div>
													<span className={styles.productName}>{item.product_name}</span>
												</div>
											</td>
											<td>{item.pack_size || '---'}</td>
											<td style={{textAlign: 'right', fontWeight: 600}}>{convertCoin(item.price)}đ</td>
											<td style={{textAlign: 'center', fontWeight: 600}}>{item.quantity}</td>
											<td style={{textAlign: 'right', fontWeight: 700, color: '#0f172a'}}>
												{convertCoin(item.subtotal)}đ
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						<div style={{marginTop: 12}}>
							<div className={styles.summaryCard}>
								<div className={styles.summaryRow}>
									<span>Tổng số lượng sản phẩm:</span>
									<strong>{order?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}</strong>
								</div>
								<div className={clsx(styles.summaryRow, styles.total)}>
									<span>Tổng tiền thanh toán:</span>
									<span className={styles.totalPrice}>{convertCoin(order?.total_amount || 0)}đ</span>
								</div>
							</div>
							<p className={styles.noteSnapshot}>* Thông tin sản phẩm được lưu snapshot cố định tại thời điểm đặt hàng.</p>
						</div>
					</WrapperForm>
				</FlexLayout>
			</WrapperFormPostion>

			{/* Dialog Xác nhận xóa */}
			<Dialog
				open={openDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa đơn hàng'
				note='Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Thao tác này không thể hoàn tác!'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setOpenDelete(false)}
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

export default DetailOrder;
