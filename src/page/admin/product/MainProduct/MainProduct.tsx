'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AddCircle, Edit, Trash, Warning2, EyeSlash} from 'iconsax-reactjs';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import Pagination from '~/components/common/Pagination';
import Switch from '~/components/common/Switch';
import Table from '~/components/common/Table';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import DataWrapper from '~/components/utils/DataWrapper';
import HeaderActions from '~/components/utils/HeaderActions';
import IconActionTable from '~/components/utils/IconActionTable';
import MainTable from '~/components/utils/MainTable';
import SearchBlock from '~/components/utils/SearchBlock';
import {PRODUCT_STATUS, QUERY_KEY} from '~/constants/config/enum';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import classifyServices from '~/services/classify.service';
import productServices from '~/services/product.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import type {IProduct, PropsMainProduct} from './interfaces';
import {Eye} from 'iconsax-react';
import TagRefItem from '~/components/utils/TagRefItem';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import PositionContainer from '~/components/common/PositionContainer';
import MainCreateProduct from '../MainCreateProduct';
import MainUpdateProduct from '../MainUpdateProduct';
import MainDetailProduct from '../MainDetailProduct';

function MainProduct({}: PropsMainProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate, _idDetail} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [classifyId, setClassifyId] = useState<string>('');
	const [sizeId, setSizeId] = useState<string>('');
	const [trademarkId, setTrademarkId] = useState<string>('');
	const [categoryId, setCategoryId] = useState<string>('');
	const [status, setStatus] = useState<string>('');

	const [idDelete, setIdDelete] = useState<string>('');
	const [confirmStatus, setConfirmStatus] = useState<{
		_id: string;
		name: string;
		currentStatus: number;
		newStatus: number;
	} | null>(null);

	const {data: classifies = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogClassify],
		queryFn: () =>
			httpRequest({
				http: classifyServices.catalog(),
			}),
	});

	const {data: sizes = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogSize],
		queryFn: () =>
			httpRequest({
				http: sizeServices.catalog(),
			}),
	});

	const {data: trademarks = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogTrademark],
		queryFn: () =>
			httpRequest({
				http: trademarkServices.catalog(),
			}),
	});

	const {data: categorys = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogCategory],
		queryFn: () =>
			httpRequest({
				http: categoryServices.catalog(),
			}),
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
		items: IProduct[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [
			QUERY_KEY.pageListProduct,
			page,
			pageSize,
			keyword,
			classifyId,
			sizeId,
			trademarkId,
			categoryId,
			status,
		],
		queryFn: () =>
			httpRequest({
				http: productServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					classify_id: classifyId,
					size_id: sizeId,
					category_id: categoryId,
					trademark_id: trademarkId,
					status: status === '' ? null : Number(status),
				}),
			}),
		staleTime: 0,
	});

	const funcUpdateStatus = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật trạng thái thành công!',
				http: productServices.updateStatus({
					_id: confirmStatus!._id,
					status: confirmStatus!.newStatus,
				}),
			}),
		onSuccess: () => {
			setConfirmStatus(null);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListProduct]});
		},
	});

	const funcDeleteProduct = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa sản phẩm thành công!',
				http: productServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListProduct]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteProduct.isPending || funcUpdateStatus.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách sản phẩm'
					actions={
						<FlexLayout row gap-6>
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
								Thêm mới
							</Button>
						</FlexLayout>
					}
				/>

				<SearchBlock
					keyword={keyword}
					setKeyword={setKeyword}
					placeholder='Tìm kiếm theo tên sản phẩm'
					action={
						<FlexLayout row gap-8 fit-height>
							<FlexItem flex-1 overflow-y scrollbar>
								<FlexLayout row gap-8>
									<FilterCustom
										name='Phân loại'
										value={classifyId}
										setValue={setClassifyId}
										listOption={classifies.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
									/>
									{/* <FilterCustom
										name='Kích cỡ'
										value={sizeId}
										setValue={setSizeId}
										listOption={sizes.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
									/>
									<FilterCustom
										name='Thương hiệu'
										value={trademarkId}
										setValue={setTrademarkId}
										listOption={trademarks.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
									/> */}
									<FilterCustom
										name='Danh mục'
										value={categoryId}
										setValue={setCategoryId}
										listOption={categorys.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
									/>
									<FilterCustom
										name='Trạng thái'
										value={status}
										setValue={setStatus}
										listOption={[
											{uuid: '1', name: 'Hiển thị'},
											{uuid: '0', name: 'Ẩn'},
										]}
									/>
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
							note='Danh sách sản phẩm hiện đang trống!'
						>
							<Table<IProduct>
								rowKey={(row) => row._id}
								data={data?.items}
								fixedHeader={true}
								column={[
									{
										title: 'STT',
										fixedLeft: true,
										render: (_, index) => <>{index + 1}</>,
									},
									{
										title: 'Tên sản phẩm',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.name}</p>,
									},
									{
										title: 'Kích thước đóng gói',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.pack_size}</p>,
									},
									{
										title: 'Giá',
										render: (row, _) => <>{convertCoin(row?.price)}</>,
									},
									{
										title: 'Danh mục',
										render: (row, _) => <>{row?.category?.name || '---'}</>,
									},
									{
										title: 'Phân loại',
										render: (row, _) => {
											const list =
												row?.classifies && row.classifies.length > 0 ? row.classifies : row?.colors;
											return (
												<>
													{list && list.length > 0 ? (
														<FlexLayout row gap-4 wrap>
															{list.map((c) => (
																<TagRefItem key={c._id} name={c.name} />
															))}
														</FlexLayout>
													) : (
														'---'
													)}
												</>
											);
										},
									},
									// {
									// 	title: 'Kích cỡ',
									// 	render: (row, _) => <>{row?.size?.name || '---'}</>,
									// },
									// {
									// 	title: 'Thương hiệu',
									// 	render: (row, _) => <>{row?.trademark?.name || '---'}</>,
									// },
									{
										title: 'SP nổi bật',
										render: (row, _) => <>{row?.is_featured ? 'Có' : 'Không'}</>,
									},
									{
										title: 'Trạng thái',
										render: (row, _) => {
											const isVisible = (row?.status ?? PRODUCT_STATUS.VISIBLE) === PRODUCT_STATUS.VISIBLE;
											return (
												<div
													style={{
														display: 'inline-flex',
														alignItems: 'center',
														gap: '8px',
														cursor: 'pointer',
													}}
													onClick={() =>
														setConfirmStatus({
															_id: row._id,
															name: row.name,
															currentStatus: row.status ?? PRODUCT_STATUS.VISIBLE,
															newStatus: isVisible ? PRODUCT_STATUS.HIDDEN : PRODUCT_STATUS.VISIBLE,
														})
													}
												>
													<Switch
														checked={isVisible}
														size='small'
														onChange={() => {}}
													/>
													<span
														style={{
															fontSize: '13px',
															fontWeight: 500,
															color: isVisible ? '#16A34A' : '#94A3B8',
														}}
													>
														{isVisible ? 'Hiển thị' : 'Ẩn'}
													</span>
												</div>
											);
										},
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (row, _) => (
											<FlexLayout row>
												<IconActionTable
													icon={<Edit color='#292D32' size={24} />}
													tooltip='Chỉnh sửa sản phẩm'
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
												<IconActionTable
													icon={<Trash color='#EE0033' size={24} />}
													tooltip='Xóa sản phẩm'
													onClick={() => setIdDelete(row?._id)}
												/>
												<IconActionTable
													icon={<Eye color='#292D32' size={24} />}
													tooltip='Chi tiết sản phẩm'
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
											</FlexLayout>
										),
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
							dependencies={[pageSize, keyword, classifyId, sizeId, trademarkId, categoryId, status]}
						/>
					</MainTable>
				</FlexItem>
			</FlexLayout>

			{/* Drawer Thêm mới sản phẩm */}
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
				<MainCreateProduct
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

			{/* Drawer Chỉnh sửa sản phẩm */}
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
				<MainUpdateProduct
					_idProduct={_idUpdate as string}
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

			{/* Drawer Chi tiết sản phẩm */}
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
				<MainDetailProduct
					_idProduct={_idDetail as string}
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

			<Dialog
				open={!!idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa sản phẩm'
				note='Bạn có chắc chắn muốn xóa sản phẩm này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteProduct.mutate}
			/>

			<Dialog
				open={!!confirmStatus}
				type={confirmStatus?.newStatus === PRODUCT_STATUS.VISIBLE ? 'primary' : 'error'}
				backgroundIconColor={confirmStatus?.newStatus === PRODUCT_STATUS.VISIBLE ? '#E0F2FE' : '#FEF3C7'}
				borderIconColor={confirmStatus?.newStatus === PRODUCT_STATUS.VISIBLE ? '#BAE6FD' : '#FDE68A'}
				title='Đổi trạng thái sản phẩm'
				note={
					<span>
						Bạn có chắc chắn muốn đổi trạng thái sản phẩm <strong>&quot;{confirmStatus?.name}&quot;</strong> sang{' '}
						<strong>{confirmStatus?.newStatus === PRODUCT_STATUS.VISIBLE ? 'Hiển thị' : 'Ẩn'}</strong> không?
					</span>
				}
				titleSubmit='Đồng ý'
				icon={
					confirmStatus?.newStatus === PRODUCT_STATUS.VISIBLE ? (
						<Eye size='28' color='#0284C7' />
					) : (
						<EyeSlash size='28' color='#D97706' />
					)
				}
				onClose={() => setConfirmStatus(null)}
				onSubmit={funcUpdateStatus.mutate}
			/>
		</Fragment>
	);
}

export default MainProduct;
