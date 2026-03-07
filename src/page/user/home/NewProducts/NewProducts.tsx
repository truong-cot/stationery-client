'use client';

import LayoutGrid from '~/components/layout/LayoutGrid';
import styles from './NewProducts.module.scss';
import type {PropsNewProducts} from './interfaces';
import {useQuery} from '@tanstack/react-query';
import {IProductClient} from '../../product/ListProduct/interfaces';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../../product/CardProduct';

function NewProducts({}: PropsNewProducts) {
	const {data: products = []} = useQuery<IProductClient[]>({
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
					<h4>Sản phẩm mới nhất</h4>
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

export default NewProducts;
