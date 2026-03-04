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
import FormCreateSize from '../FormCreateSize';
import FormUpdateSize from '../FormUpdateSize';
import type {ISize, PropsMainSize} from './interfaces';
import FilterCustom from '~/components/common/FilterCustom';
import categoryServices from '~/services/category.service';
import sizeServices from '~/services/size.service';

function MainSize({}: PropsMainSize) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [categoryId, setCategoryId] = useState<string>('');

	const [idDelete, setIdDelete] = useState<string>('');

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
		items: ISize[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListSize, page, pageSize, keyword, categoryId],
		queryFn: () =>
			httpRequest({
				http: sizeServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					category_id: categoryId,
				}),
			}),
	});

	const funcDeleteSize = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa kích cỡ thành công!',
				http: sizeServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListSize]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteSize.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách kích cỡ'
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
					placeholder='Tìm kiếm theo tên kích cỡ'
					action={
						<FlexLayout row gap-8 fit-height>
							<FlexItem flex-1 overflow-y scrollbar>
								<FlexLayout row gap-8>
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
							note='Danh sách kích cỡ hiện đang trống!'
						>
							<Table<ISize>
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
										title: 'Tên kích cỡ',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.name}</p>,
									},
									{
										title: 'Danh mục',
										render: (row, _) => (
											<>
												{row?.categories?.length > 0 ? (
													<>
														{row?.categories?.[0]?.name}
														{row?.categories?.length! > 1 && (
															<Tippy
																content={
																	<ol style={{paddingLeft: '16px'}}>
																		{row?.categories?.slice(1)?.map((v) => (
																			<li key={v._id}>{v?.name}</li>
																		))}
																	</ol>
																}
															>
																<b style={{cursor: 'pointer', marginLeft: '4px'}}>
																	và {row?.categories?.length! - 1} danh mục khác
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
													tooltip='Chỉnh sửa kích cỡ'
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
													tooltip='Xóa kích cỡ'
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
							dependencies={[pageSize, keyword, categoryId]}
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
				<FormCreateSize
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
				<FormUpdateSize
					_idSize={_idUpdate as string}
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
				title='Xóa kích cỡ'
				note='Bạn có chắc chắn muốn xóa kích cỡ này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteSize.mutate}
			/>
		</Fragment>
	);
}

export default MainSize;
