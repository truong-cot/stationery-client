'use client';

import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import {ArrowRight2, MagicStar} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../../product/CardProduct';
import SkeletonCardProduct from '~/components/common/SkeletonCardProduct';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import {IProductClient} from '../../product/MainProduct/components/ListProduct/interfaces';
import styles from './NewProducts.module.scss';
import type {PropsNewProducts} from './interfaces';

function NewProducts({}: PropsNewProducts) {
	const {data: products = [], isLoading} = useQuery<IProductClient[]>({
		queryKey: [QUERY_KEY.clientProductNew],
		queryFn: () =>
			httpRequest({
				http: clientServices.productNew(),
			}),
	});

	return (
		<LayoutGrid>
			<section className={styles.new_products}>
				<div className={styles.head}>
					<div className={styles.title_group}>
						<div className={styles.icon_wrap}>
							<MagicStar size='20' color='#00b7c4' variant='Bold' />
						</div>
						<h2 className={styles.title}>Sản phẩm mới nhất</h2>
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

export default NewProducts;
