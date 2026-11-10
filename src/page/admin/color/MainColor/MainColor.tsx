'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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
import colorServices from '~/services/color.service';
import FormCreateColor from '../FormCreateColor';
import FormUpdateColor from '../FormUpdateColor';
import type {IColor, PropsMainColor} from './interfaces';

function MainColor({}: PropsMainColor) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');

	const [idDelete, setIdDelete] = useState<string>('');

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
		items: IColor[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListColor, page, pageSize, keyword],
		queryFn: () =>
			httpRequest({
				http: colorServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
				}),
			}),
	});

	const funcDeleteColor = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa màu sắc thành công!',
				http: colorServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListColor]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteColor.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách màu sắc'
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
					placeholder='Tìm kiếm theo tên, mã màu sắc'
				/>

				<FlexItem flex-1 overflow-x>
					<MainTable>
						<DataWrapper
							data={data?.items}
							loading={isLoading}
							title='Dữ liệu trống!'
							note='Danh sách màu sắc hiện đang trống!'
						>
							<Table<IColor>
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
										title: 'Hiển thị',
										render: (row, _) => (
											<div style={{width: 60, height: 20, borderRadius: 4, background: row.code}}></div>
										),
									},
									{
										title: 'Mã màu',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.code}</p>,
									},
									{
										title: 'Tên màu',
										render: (row, _) => <>{row?.name}</>,
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
													tooltip='Chỉnh sửa màu sắc'
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
													tooltip='Xóa màu sắc'
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
							dependencies={[pageSize, keyword]}
						/>
					</MainTable>
				</FlexItem>
			</FlexLayout>

			<PositionContainer
				open={_action == 'create'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_action'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormCreateColor
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
				<FormUpdateColor
					_idColor={_idUpdate as string}
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

			<Dialog
				open={!!idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa màu sắc'
				note='Bạn có chắc chắn muốn xóa màu sắc này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteColor.mutate}
			/>
		</Fragment>
	);
}

export default MainColor;
