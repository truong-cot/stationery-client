'use client';

import {AddCircle} from 'iconsax-reactjs';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Fragment} from 'react';
import Button from '~/components/common/Button';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import HeaderActions from '~/components/utils/HeaderActions';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import TableCategory from '../TableCategory';
import type {PropsMainCategory} from './interfaces';
import styles from './MainCategory.module.scss';
import clsx from 'clsx';
import {Data, TextalignJustifycenter, Warning2} from 'iconsax-react';
import TreeCategory from '../TreeCategory';
import Tippy from '@tippyjs/react';
import PositionContainer from '~/components/common/PositionContainer';
import FormUpdateCategory from '../FormUpdateCategory';
import FormCreateCategory from '../FormCreateCategory';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';

function MainCategory({}: PropsMainCategory) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_view, _action, _idUpdate, _idDelete, _idParent} = getQueryParams(searchParams);

	const funcDeleteCategory = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa danh mục thành công!',
				http: categoryServices.delete({
					_id: _idDelete as string,
				}),
			}),
		onSuccess: () => {
			updateQueryParams(router, pathname, searchParams, {
				delete: ['_idDelete'],
				options: {
					scroll: false,
				},
			});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListCategory]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.treeCategoryFull]});
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

				<FlexItem>
					<FlexLayout row gap-6 justify-end>
						<Tippy content='Xem dạng bảng'>
							<div
								className={clsx(styles.view, {[styles.active]: !_view})}
								onClick={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_view'],
										options: {
											scroll: false,
										},
									})
								}
							>
								<TextalignJustifycenter size={18} color='#fff' />
							</div>
						</Tippy>
						<Tippy content='Xem dạng cây'>
							<div
								className={clsx(styles.view, {[styles.active]: _view == 'tree'})}
								onClick={() =>
									updateQueryParams(router, pathname, searchParams, {
										set: {
											_view: 'tree',
										},
										options: {
											scroll: false,
										},
									})
								}
							>
								<Data size={18} color='#fff' />
							</div>
						</Tippy>
					</FlexLayout>
				</FlexItem>

				<FlexItem flex-1 overflow-x>
					{!_view && <TableCategory />}
					{_view == 'tree' && <TreeCategory />}
				</FlexItem>
			</FlexLayout>

			<PositionContainer
				open={_action == 'create'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_action', '_idParent'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormCreateCategory
					_idParent={!!_idParent ? (_idParent as string) : ''}
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_action', '_idParent'],
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
				<FormUpdateCategory
					_idCategory={_idUpdate as string}
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
				open={!!_idDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa danh mục'
				note='Bạn có chắc chắn muốn xóa danh mục này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_idDelete'],
						options: {
							scroll: false,
						},
					})
				}
				onSubmit={funcDeleteCategory.mutate}
			/>
		</Fragment>
	);
}

export default MainCategory;
