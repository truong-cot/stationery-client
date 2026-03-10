'use client';

import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import styles from './MainDetailProduct.module.scss';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import type {PropsMainDetailProduct} from './interfaces';
import {useParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {IProductClient} from '../MainProduct/components/ListProduct/interfaces';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import DataWrapper from '~/components/utils/DataWrapper';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../CardProduct';

function MainDetailProduct({product}: PropsMainDetailProduct) {
	const params = useParams();

	const {_id} = params;

	const {data: products = [], isLoading} = useQuery<IProductClient[]>({
		queryKey: [QUERY_KEY.clientProductSimilar, _id],
		queryFn: () =>
			httpRequest({
				http: clientServices.productSimilar({product_id: _id as string}),
			}),
		enabled: !!_id,
	});

	return (
		<LayoutGrid>
			<div className={styles.head}>
				<div className={styles.breadcrumb}>
					<Breadcrumb
						isPadding={false}
						listUrls={[
							{path: PATH.Home, title: 'Trang chủ'},
							...(product?.tree_category?.map((cat) => ({
								path: `${PATH.Product}?_categoryId=${cat._id}`,
								title: cat.name,
							})) || []),
							{path: '', title: product?.name},
						]}
					/>
				</div>
			</div>

			<div className={styles.main}>
				<ProductImages images={product?.images} />
				<ProductInfo product={product} />
			</div>

			<section className={styles.section}>
				<div className={styles.head_section}>
					<h4>Sản phẩm tương tự</h4>
				</div>
				<DataWrapper
					data={products}
					loading={isLoading}
					small={true}
					title=''
					note='Không tìm thấy sản phẩm tương tự cho sản phẩm này!'
				>
					<GridColumn col_4_small>
						{products?.map((product) => (
							<CardProduct key={product._id} product={product} />
						))}
					</GridColumn>
				</DataWrapper>
			</section>
		</LayoutGrid>
	);
}

export default MainDetailProduct;
