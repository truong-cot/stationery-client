import PaginationQuery from '~/components/common/PaginationQuery';
import styles from './ListProduct.module.scss';
import type {IProductClient, PropsListProduct} from './interfaces';
import {useSearchParams} from 'next/navigation';
import {getQueryParams} from '~/funcs/queryParams';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../../../CardProduct';
import DataWrapper from '~/components/utils/DataWrapper';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import {LIMIT} from '~/components/common/PaginationQuery/PaginationQuery';

function ListProduct({}: PropsListProduct) {
	const searchParams = useSearchParams();

	const {_page, _categoryId, _sizeId, _trademarkId, _priceId, _colorId, _keyword, _sort} = getQueryParams(searchParams);

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
		items: IProductClient[];
		pagination: {
			currentPage: number;
			totalCount: number;
		};
	}>({
		queryKey: [QUERY_KEY.clientPageListProduct, _page, _categoryId, _sizeId, _trademarkId, _priceId, _colorId, _keyword, _sort],
		queryFn: () =>
			httpRequest({
				http: clientServices.pageListProduct({
					page: Number(_page) || 1,
					pageSize: LIMIT,
					keyword: _keyword as string,
					category_id: _categoryId as string,
					color_id: _colorId as string,
					size_id: _sizeId as string,
					trademark_id: _trademarkId as string,
					setup_price_id: _priceId as string,
					sort: _sort as string,
				}),
			}),
	});

	return (
		<div className={styles.list_product}>
			<DataWrapper data={data?.items} loading={isLoading} title='Sản phẩm trống!' note='Không tìm thấy sản phẩm phù hợp!'>
				<GridColumn col_4_small>
					{data?.items?.map((product) => (
						<CardProduct key={product._id} product={product} />
					))}
				</GridColumn>
			</DataWrapper>
			<div className={styles.pagination}>
				<PaginationQuery
					total={data?.pagination?.totalCount || 0}
					currentPage={Number(_page) || 1}
					dependencies={[_categoryId, _sizeId, _trademarkId, _priceId, _colorId, _keyword]}
				/>
			</div>
		</div>
	);
}

export default ListProduct;
