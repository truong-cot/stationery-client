import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import {Add, Additem, BoxAdd, Edit, Trash, Warning2} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useState} from 'react';
import Dialog from '~/components/common/Dialog';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
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
import colorServices from '~/services/color.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import type {ICategory, PropsTableCategory} from './interfaces';
import {PATH} from '~/constants/config';

function TableCategory({}: PropsTableCategory) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [keyword, setKeyword] = useState<string>('');
	const [colorId, setColorId] = useState<string>('');
	const [sizeId, setSizeId] = useState<string>('');
	const [trademarkId, setTrademarkId] = useState<string>('');

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

	return (
		<FlexLayout column gap-12>
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
						dependencies={[pageSize, keyword, colorId, sizeId, trademarkId]}
					/>
				</MainTable>
			</FlexItem>
		</FlexLayout>
	);
}

export default TableCategory;
