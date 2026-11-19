'use client';

import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'next/navigation';
import SearchQuery from '~/components/common/SearchQuery';
import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {ContextProduct, ICatalog} from '~/contexts/ContextProduct';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import FilterProduct from './components/FilterProduct';
import ListProduct from './components/ListProduct';
import type {PropsMainProduct} from './interfaces';
import styles from './MainProduct.module.scss';

function MainProduct({}: PropsMainProduct) {
	const searchParams = useSearchParams();

	const {_categoryId} = getQueryParams(searchParams);

	const {data: categorys = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogCategory, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogCategory(),
			}),
	});

	const {data: sizes = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogSize],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogSize(),
			}),
	});

	return (
		<ContextProduct.Provider
			value={{categorys, sizes}}
		>
			<div className={styles.main_product}>
				<LayoutGrid>
					<h1 className={styles.sr_only}>Danh sách sản phẩm văn phòng phẩm Huyền Anh</h1>
					{/* Header: Breadcrumb & Search */}
					<div className={styles.head}>
						<div className={styles.breadcrumb}>
							<Breadcrumb
								isPadding={false}
								listUrls={[
									{path: PATH.Home, title: 'Trang chủ'},
									{path: '', title: 'Danh sách sản phẩm'},
								]}
							/>
						</div>
						<div className={styles.input_search}>
							<SearchQuery placeholder='Tìm kiếm sản phẩm...' keyName='_keyword' />
						</div>
					</div>

					{/* Main Layout: Filter on TOP, Products on BOTTOM */}
					<div className={styles.main}>
						{/* Top Filter */}
						<div className={styles.filter_top}>
							<FilterProduct />
						</div>

						{/* Product List */}
						<div className={styles.content}>
							<ListProduct />
						</div>
					</div>
				</LayoutGrid>
			</div>
		</ContextProduct.Provider>
	);
}

export default MainProduct;
