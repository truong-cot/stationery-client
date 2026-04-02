'use client';

import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import SearchQuery from '~/components/common/SearchQuery';
import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import icons from '~/constants/images/icons';
import {ContextProduct, ICatalog, ICatalogSetupPrice} from '~/contexts/ContextProduct';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import FilterProduct from './components/FilterProduct';
import ListProduct from './components/ListProduct';
import SortProduct from './components/SortProduct';
import type {PropsMainProduct} from './interfaces';
import styles from './MainProduct.module.scss';
import Adsense from '~/components/seo/Adsense';

function MainProduct({}: PropsMainProduct) {
	const searchParams = useSearchParams();

	const {_categoryId} = getQueryParams(searchParams);

	const [openTabsMobile, setOpenTabsMobile] = useState<boolean>(false);

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
		enabled: !!_categoryId,
	});

	const {data: sizes = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogSize, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogSize({category_id: _categoryId as string}),
			}),
		enabled: !!_categoryId,
	});

	const {data: trademarks = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogTrademark, _categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogTrademark({category_id: _categoryId as string}),
			}),
		enabled: !!_categoryId,
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
			<div className={styles.main_product}>
				<LayoutGrid>
					{/* <Adsense slot='2217508996' /> */}
					<div className={styles.head}>
						<div className={styles.menu_line} onClick={() => setOpenTabsMobile(true)}>
							<Image alt='Menu line' src={icons.menuLine} width={20} height={20} />
						</div>
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
							<SearchQuery placeholder='Tìm kiếm sản phẩm' keyName='_keyword' />
						</div>
					</div>

					<div className={styles.main}>
						<div className={styles.filter_product}>
							<FilterProduct />
						</div>
						<div>
							<SortProduct />
							<ListProduct />
						</div>
					</div>

					<div className={clsx(styles.filter_product_mobile, {[styles.open]: openTabsMobile})}>
						<FilterProduct onClose={() => setOpenTabsMobile(false)} />
					</div>
				</LayoutGrid>
			</div>
		</ContextProduct.Provider>
	);
}

export default MainProduct;
