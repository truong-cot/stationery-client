'use client';

import LayoutGrid from '~/components/layout/LayoutGrid';
import styles from './FeaturedProducts.module.scss';
import type {PropsFeaturedProducts} from './interfaces';
import {useQuery} from '@tanstack/react-query';
import {IProductClient} from '../../product/ListProduct/interfaces';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../../product/CardProduct';

function FeaturedProducts({}: PropsFeaturedProducts) {
	const {data: products = []} = useQuery<IProductClient[]>({
		queryKey: [QUERY_KEY.clientProductFeatured],
		queryFn: () =>
			httpRequest({
				http: clientServices.productFeatured(),
			}),
	});

	return (
		<LayoutGrid>
			<section className={styles.featured_products}>
				<div className={styles.head}>
					<h4>Sản phẩm nổi bật</h4>
				</div>
				<GridColumn col_4_small>
					{products?.map((product) => (
						<CardProduct key={product._id} product={product} />
					))}
				</GridColumn>
			</section>
		</LayoutGrid>
	);
}

export default FeaturedProducts;
