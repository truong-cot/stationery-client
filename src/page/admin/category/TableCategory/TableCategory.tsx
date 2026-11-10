import {useQuery} from '@tanstack/react-query';
import {Additem, BoxAdd, Edit, Trash} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import DataWrapper from '~/components/utils/DataWrapper';
import IconActionTable from '~/components/utils/IconActionTable';
import MainTable from '~/components/utils/MainTable';
import SearchBlock from '~/components/utils/SearchBlock';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import {updateQueryParams} from '~/funcs/queryParams';
import categoryServices from '~/services/category.service';
import type {ICategory, PropsTableCategory} from './interfaces';
import {PATH} from '~/constants/config';

function TableCategory({}: PropsTableCategory) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');

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
		queryKey: [QUERY_KEY.pageListCategory, page, pageSize, keyword],
		queryFn: () =>
			httpRequest({
				http: categoryServices.getPageList({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
				}),
			}),
	});

	return (
		<FlexLayout column gap-12>
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên, mã danh mục'
			/>

			<FlexItem flex-1 overflow-x>
				<MainTable>
					<DataWrapper data={data?.items} loading={isLoading} title='Dữ liệu trống!' note='Danh sách danh mục hiện đang trống!'>
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
									title: 'Mô tả',
									render: (row, _) => <>{row?.description || '---'}</>,
								},
								{
									title: 'Hành động',
									fixedRight: true,
									render: (row, _) => (
										<FlexLayout row>
											<IconActionTable
												icon={<BoxAdd color='#F79009' size={24} />}
												tooltip='Thêm sản phẩm'
												href={`${PATH.AdminCreateProduct}?_idCategory=${row._id}`}
											/>
											<IconActionTable
												icon={<Additem color='#0EB260' size={24} />}
												tooltip='Thêm danh mục con'
												onClick={() =>
													updateQueryParams(router, pathname, searchParams, {
														set: {
															_action: 'create',
															_idParent: row?._id,
														},
														options: {
															scroll: false,
														},
													})
												}
											/>
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
												onClick={() =>
													updateQueryParams(router, pathname, searchParams, {
														set: {
															_idDelete: row?._id,
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
						dependencies={[pageSize, keyword]}
					/>
				</MainTable>
			</FlexItem>
		</FlexLayout>
	);
}

export default TableCategory;
