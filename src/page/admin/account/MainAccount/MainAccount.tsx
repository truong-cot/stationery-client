'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AddCircle, Edit, RefreshSquare, Trash, Warning2} from 'iconsax-reactjs';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
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
import accountServices from '~/services/account.service';
import {RootState} from '~/store';
import FormCreateAccount from '../FormCreateAccount';
import FormResetPassword from '../FormResetPassword';
import FormUpdateAccount from '../FormUpdateAccount';
import type {IAccount, PropsMainAccount} from './interfaces';

function MainAccount({}: PropsMainAccount) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_action, _idUpdate, _idReset} = getQueryParams(searchParams);

	const {infoUser} = useSelector((state: RootState) => state.user);

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
		items: IAccount[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.pageListAccount, page, pageSize, keyword],
		queryFn: () =>
			httpRequest({
				http: accountServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
				}),
			}),
	});

	const funcDeleteAccount = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa tài khoản thành công!',
				http: accountServices.delete({
					_id: idDelete,
				}),
			}),
		onSuccess: () => {
			setIdDelete('');
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListAccount]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteAccount.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions
					title='Danh sách tài khoản'
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

				<SearchBlock keyword={keyword} setKeyword={setKeyword} placeholder='Tìm kiếm theo tên, tài khoản đăng nhập' />

				<FlexItem flex-1 overflow-x>
					<MainTable>
						<DataWrapper
							data={data?.items}
							loading={isLoading}
							title='Dữ liệu trống!'
							note='Danh sách tài khoản hiện đang trống!'
						>
							<Table<IAccount>
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
										title: 'Họ và tên',
										render: (row, _) => <p style={{fontWeight: '600'}}>{row?.name}</p>,
									},
									{
										title: 'Tên đăng nhập',
										render: (row, _) => <>{row?.username}</>,
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
													disnable={infoUser?._id == row?._id}
													icon={<Edit color='#292D32' size={24} />}
													tooltip='Chỉnh sửa tài khoản'
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
													disnable={infoUser?._id == row?._id}
													icon={<RefreshSquare color='#EE0033' size={24} />}
													tooltip='Reset mật khẩu'
													onClick={() =>
														updateQueryParams(router, pathname, searchParams, {
															set: {
																_idReset: row?._id,
															},
															options: {
																scroll: false,
															},
														})
													}
												/>
												<IconActionTable
													disnable={infoUser?._id == row?._id}
													icon={<Trash color='#EE0033' size={24} />}
													tooltip='Xóa tài khoản'
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
					})
				}
			>
				<FormCreateAccount
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
				<FormUpdateAccount
					_idAccount={_idUpdate as string}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_idUpdate'],
						})
					}
				/>
			</PositionContainer>

			<PositionContainer
				open={!!_idReset}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_idReset'],
					})
				}
			>
				<FormResetPassword
					_idAccount={_idReset as string}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_idReset'],
						})
					}
				/>
			</PositionContainer>

			<Dialog
				open={!!idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa tài khoản'
				note='Bạn có chắc chắn muốn xóa tài khoản này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setIdDelete('')}
				onSubmit={funcDeleteAccount.mutate}
			/>
		</Fragment>
	);
}

export default MainAccount;
