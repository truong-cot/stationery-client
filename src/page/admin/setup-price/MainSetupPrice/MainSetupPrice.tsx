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
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin, renderRangePrice} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import setupPriceServices from '~/services/setup-price.service';
import FormCreateSetupPrice from '../FormCreateSetupPrice';
import FormUpdateSetupPrice from '../FormUpdateSetupPrice';
import type {ISetupPrice, PropsMainSetupPrice} from './interfaces';

function MainSetupPrice({}: PropsMainSetupPrice) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate} = getQueryParams(searchParams);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);

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
		items: ISetupPrice[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListSetupPrice, page, pageSize],
		queryFn: () =>
			httpRequest({
				http: setupPriceServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: '',
				}),
			}),
	});

	const funcDeleteSetupPrice = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa khoảng giá thành công!',
				http: setupPriceServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListSetupPrice]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteSetupPrice.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách khoảng giá'
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

				<FlexItem flex-1 overflow-x>
					<MainTable>
						<DataWrapper
							data={data?.items}
							loading={isLoading}
							title='Dữ liệu trống!'
							note='Danh sách khoảng giá hiện đang trống!'
						>
							<Table<ISetupPrice>
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
										title: 'Khoảng giá',
										render: (row, _) => (
											<p style={{fontWeight: '600'}}>{renderRangePrice({min: row.min, max: row.max})}</p>
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
													tooltip='Chỉnh sửa khoảng giá'
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
													tooltip='Xóa khoảng giá'
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
							dependencies={[pageSize]}
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
				<FormCreateSetupPrice
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
				<FormUpdateSetupPrice
					_idSetupPrice={_idUpdate as string}
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
				title='Xóa khoảng giá'
				note='Bạn có chắc chắn muốn xóa khoảng giá này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteSetupPrice.mutate}
			/>
		</Fragment>
	);
}

export default MainSetupPrice;
