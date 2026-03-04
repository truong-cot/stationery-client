'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import {AddCircle, Edit, Trash, Warning2} from 'iconsax-reactjs';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
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
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import FormCreateCategory from '../FormCreateCategory';
import FormUpdateCategory from '../FormUpdateCategory';
import type {ICategory, PropsMainCategory} from './interfaces';
import FilterCustom from '~/components/common/FilterCustom';
import categoryServices from '~/services/category.service';
import trademarkServices from '~/services/trademark.service';
import sizeServices from '~/services/size.service';
import colorServices from '~/services/color.service';

function MainCategory({}: PropsMainCategory) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [colorId, setColorId] = useState<string>('');
	const [sizeId, setSizeId] = useState<string>('');
	const [trademarkId, setTrademarkId] = useState<string>('');

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
		items: ICategory[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListCategory, page, pageSize, keyword, colorId, sizeId, trademarkId],
		queryFn: () =>
			httpRequest({
				http: categoryServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					color_id: colorId,
					size_id: sizeId,
					trademark_id: trademarkId,
				}),
			}),
	});

	const funcDeleteCategory = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa danh mục thành công!',
				http: categoryServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListCategory]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteCategory.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách danh mục'
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
					placeholder='Tìm kiếm theo tên, mã danh mục'
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
							note='Danh sách danh mục hiện đang trống!'
						>
							<Table<ICategory>
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
										title: 'Tên danh mục',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.name}</p>,
									},
									{
										title: 'Danh mục cha',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.parent?.name || '---'}</p>,
									},
									{
										title: 'Màu sắc',
										render: (row, _) => (
											<>
												{row?.colors?.length > 0 ? (
													<>
														{row?.colors?.[0]?.name}
														{row?.colors?.length! > 1 && (
															<Tippy
																content={
																	<ol style={{paddingLeft: '16px'}}>
																		{row?.colors?.slice(1)?.map((v) => (
																			<li key={v._id}>{v?.name}</li>
																		))}
																	</ol>
																}
															>
																<b style={{cursor: 'pointer', marginLeft: '4px'}}>
																	và {row?.colors?.length! - 1} màu sắc khác
																</b>
															</Tippy>
														)}
													</>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Kích cỡ',
										render: (row, _) => (
											<>
												{row?.sizes?.length > 0 ? (
													<>
														{row?.sizes?.[0]?.name}
														{row?.sizes?.length! > 1 && (
															<Tippy
																content={
																	<ol style={{paddingLeft: '16px'}}>
																		{row?.sizes?.slice(1)?.map((v) => (
																			<li key={v._id}>{v?.name}</li>
																		))}
																	</ol>
																}
															>
																<b style={{cursor: 'pointer', marginLeft: '4px'}}>
																	và {row?.sizes?.length! - 1} kích cỡ khác
																</b>
															</Tippy>
														)}
													</>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Thương hiệu',
										render: (row, _) => (
											<>
												{row?.trademarks?.length > 0 ? (
													<>
														{row?.trademarks?.[0]?.name}
														{row?.trademarks?.length! > 1 && (
															<Tippy
																content={
																	<ol style={{paddingLeft: '16px'}}>
																		{row?.trademarks?.slice(1)?.map((v) => (
																			<li key={v._id}>{v?.name}</li>
																		))}
																	</ol>
																}
															>
																<b style={{cursor: 'pointer', marginLeft: '4px'}}>
																	và {row?.trademarks?.length! - 1} thương hiệu khác
																</b>
															</Tippy>
														)}
													</>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Mô tả',
										render: (row, _) => <>{row?.description || '---'}</>,
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (row, _) => (
											<FlexLayout row>
												<IconActionTable
													icon={<Edit color='#292D32' size={24} />}
													tooltip='Chỉnh sửa danh mục'
													onClick={() =>
														updateQueryParams(router, pathname, searchParams, {
															set: {
																_idUpdate: row?._id,
															},
															options: {
																scroll: false,
															},
														})
													}
												/>
												<IconActionTable
													icon={<Trash color='#EE0033' size={24} />}
													tooltip='Xóa danh mục'
													onClick={() => setIdDelete(row?._id)}
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
							dependencies={[pageSize, keyword, colorId, sizeId, trademarkId]}
						/>
					</MainTable>
				</FlexItem>
			</FlexLayout>

			<PositionContainer
				open={_action == 'create'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_action'],
					})
				}
			>
				<FormCreateCategory
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_action'],
						})
					}
				/>
			</PositionContainer>

			<PositionContainer
				open={!!_idUpdate}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_idUpdate'],
					})
				}
			>
				<FormUpdateCategory
					_idCategory={_idUpdate as string}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_idUpdate'],
						})
					}
				/>
			</PositionContainer>

			<Dialog
				open={!!idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa danh mục'
				note='Bạn có chắc chắn muốn xóa danh mục này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteCategory.mutate}
			/>
		</Fragment>
	);
}

export default MainCategory;
