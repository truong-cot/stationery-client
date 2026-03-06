'use client';

import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'next/navigation';
import SearchQuery from '~/components/common/SearchQuery';
import LayoutGrid from '~/components/layout/LayoutGrid';
import BannerImage from '~/components/utils/BannerImage';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import images from '~/constants/images/images';
import {ContextProduct, ICatalog, ICatalogSetupPrice} from '~/contexts/ContextProduct';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import FilterProduct from '../FilterProduct';
import ListProduct from '../ListProduct';
import SortProduct from '../SortProduct';
import styles from './MainProduct.module.scss';
import type {PropsMainProduct} from './interfaces';

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

	const {data: colors = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogColor, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogColor({category_id: _categoryId as string}),
			}),
	});

	const {data: sizes = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogSize, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogSize({category_id: _categoryId as string}),
			}),
	});

	const {data: trademarks = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogTrademark, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogTrademark({category_id: _categoryId as string}),
			}),
	});

	const {data: setupPrices = []} = useQuery<ICatalogSetupPrice[]>({
		queryKey: [QUERY_KEY.clientCatalogSetupPrice],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogSetupPrice(),
			}),
	});

	return (
		<ContextProduct.Provider
			value={{colors: colors, categorys: categorys, sizes: sizes, trademarks: trademarks, setupPrices: setupPrices}}
		>
			<BannerImage image={images.bannerProduct} />
			<LayoutGrid>
				<div className={styles.head}>
					<div className={styles.breadcrumb}>
						<Breadcrumb
							isPadding={false}
							listUrls={[
								{path: PATH.Home, title: 'Trang chủ'},
								{path: '', title: 'Sản phẩm'},
							]}
						/>
					</div>
					<div className={styles.input_search}>
						<SearchQuery placeholder='Tìm kiếm sản phẩm' keyName='_keyword' />
					</div>
				</div>

				<div className={styles.grid}>
					<FilterProduct />
					<div>
						<SortProduct />
						<ListProduct />
					</div>
				</div>
			</LayoutGrid>
		</ContextProduct.Provider>
	);
}

export default MainProduct;
