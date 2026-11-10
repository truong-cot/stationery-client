'use client';

import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import {ArrowRight2, HeartTick} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../../product/CardProduct';
import SkeletonCardProduct from '~/components/common/SkeletonCardProduct';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import {IProductClient} from '../../product/MainProduct/components/ListProduct/interfaces';
import styles from './FeaturedProducts.module.scss';
import type {PropsFeaturedProducts} from './interfaces';

function FeaturedProducts({}: PropsFeaturedProducts) {
	const {data: products = [], isLoading} = useQuery<IProductClient[]>({
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
					<div className={styles.title_group}>
						<div className={styles.icon_wrap}>
							<HeartTick size='20' color='#ea384c' variant='Bold' />
						</div>
						<h2 className={styles.title}>Sản phẩm nổi bật</h2>
					</div>

					<Link href={`${PATH.Product}?_sort=1`} className={styles.view_all_link}>
						<span>Xem tất cả</span>
						<ArrowRight2 size='16' color='#00b7c4' />
					</Link>
				</div>

				<GridColumn col_5>
					{isLoading ? (
						<SkeletonCardProduct count={8} />
					) : (
						products?.map((product) => <CardProduct key={product._id} product={product} />)
					)}
				</GridColumn>
			</section>
		</LayoutGrid>
	);
}

export default FeaturedProducts;
