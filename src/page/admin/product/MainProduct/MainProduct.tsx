'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AddCircle, Edit, Trash, Warning2} from 'iconsax-reactjs';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import DataWrapper from '~/components/utils/DataWrapper';
import HeaderActions from '~/components/utils/HeaderActions';
import IconActionTable from '~/components/utils/IconActionTable';
import MainTable from '~/components/utils/MainTable';
import SearchBlock from '~/components/utils/SearchBlock';
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import colorServices from '~/services/color.service';
import productServices from '~/services/product.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import type {IProduct, PropsMainProduct} from './interfaces';
import {Eye} from 'iconsax-react';
import {PATH} from '~/constants/config';

function MainProduct({}: PropsMainProduct) {
	const queryClient = useQueryClient();

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [colorId, setColorId] = useState<string>('');
	const [sizeId, setSizeId] = useState<string>('');
	const [trademarkId, setTrademarkId] = useState<string>('');
	const [categoryId, setCategoryId] = useState<string>('');

	const [idDelete, setIdDelete] = useState<string>('');

	const {data: colors = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogColor],
		queryFn: () =>
			httpRequest({
				http: colorServices.catalog({category_id: ''}),
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
				http: sizeServices.catalog({category_id: ''}),
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
				http: trademarkServices.catalog({category_id: ''}),
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
		queryKey: [QUERY_KEY.pageListProduct, page, pageSize, keyword, colorId, sizeId, trademarkId, categoryId],
		queryFn: () =>
			httpRequest({
				http: productServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					color_id: colorId,
					size_id: sizeId,
					category_id: categoryId,
					trademark_id: trademarkId,
				}),
			}),
		staleTime: 0,
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
			<Loading loading={funcDeleteProduct.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách sản phẩm'
					actions={
						<FlexLayout row gap-6>
							<Button icon={<AddCircle />} p_8_24 rounded_40 bright-cyan bold href={PATH.AdminCreateProduct}>
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
										name='Màu sắc'
										value={colorId}
										setValue={setColorId}
										listOption={colors.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
									/>
									<FilterCustom
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
									/>
									<FilterCustom
										name='Danh mục'
										value={categoryId}
										setValue={setCategoryId}
										listOption={categorys.map((item) => ({
											uuid: item._id,
											name: item.name,
										}))}
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
										render: (row, _) => <>{row?.category.name}</>,
									},
									// {
									// 	title: 'Màu sắc',
									// 	render: (row, _) => <>{row?.color.name || '---'}</>,
									// },
									// {
									// 	title: 'Kích cỡ',
									// 	render: (row, _) => <>{row?.size.name || '---'}</>,
									// },
									// {
									// 	title: 'Thương hiệu',
									// 	render: (row, _) => <>{row?.trademark.name || '---'}</>,
									// },
									{
										title: 'SP nổi bật',
										render: (row, _) => <>{row?.is_featured ? 'Có' : 'Không'}</>,
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (row, _) => (
											<FlexLayout row>
												<IconActionTable
													icon={<Edit color='#292D32' size={24} />}
													tooltip='Chỉnh sửa sản phẩm'
													href={`${PATH.AdminUpdateProduct}?_id=${row._id}`}
												/>
												<IconActionTable
													icon={<Trash color='#EE0033' size={24} />}
													tooltip='Xóa sản phẩm'
													onClick={() => setIdDelete(row?._id)}
												/>
												<IconActionTable
													icon={<Eye color='#292D32' size={24} />}
													tooltip='Chi tiết sản phẩm'
													href={`${PATH.AdminProduct}/${row._id}`}
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
							dependencies={[pageSize, keyword, colorId, sizeId, trademarkId, categoryId]}
						/>
					</MainTable>
				</FlexItem>
			</FlexLayout>

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
		</Fragment>
	);
}

export default MainProduct;
