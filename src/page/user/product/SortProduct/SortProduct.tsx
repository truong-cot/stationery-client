import TagRefItem from '~/components/utils/TagRefItem';
import styles from './SortProduct.module.scss';
import type {PropsSortProduct} from './interfaces';
import FlexLayout from '~/components/layout/FlexLayout';
import {useContext} from 'react';
import {ContextProduct, IContextProduct} from '~/contexts/ContextProduct';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {renderRangePrice} from '~/funcs/convertCoin';

function SortProduct({}: PropsSortProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {_categoryId, _sizeId, _trademarkId, _priceId, _colorId} = getQueryParams(searchParams);

	const {colors, sizes, trademarks, setupPrices, categorys} = useContext<IContextProduct>(ContextProduct);

	return (
		<div className={styles.sort_product}>
			<div className={styles.selected}>
				<p>Bộ lọc:</p>

				{!_categoryId && !_sizeId && !_trademarkId && !_priceId && !_colorId && <TagRefItem name='Tất cả' />}

				<FlexLayout row gap-6 wrap>
					{!!_categoryId && (
						<TagRefItem
							name={categorys?.find((v) => v._id == (_categoryId as string))?.name!}
							onClean={() =>
								updateQueryParams(router, pathname, searchParams, {
									delete: ['_categoryId', '_colorId', '_sizeId', '_trademarkId'],
									options: {
										scroll: false,
									},
								})
							}
						/>
					)}

					{!!_priceId && (
						<TagRefItem
							name={renderRangePrice({
								min: setupPrices?.find((v) => v._id == (_priceId as string))?.min!,
								max: setupPrices?.find((v) => v._id == (_priceId as string))?.max!,
							})}
							onClean={() =>
								updateQueryParams(router, pathname, searchParams, {
									delete: ['_priceId'],
									options: {
										scroll: false,
									},
								})
							}
						/>
					)}

					{!!_colorId && (
						<TagRefItem
							name={colors?.find((v) => v._id == (_colorId as string))?.name!}
							onClean={() =>
								updateQueryParams(router, pathname, searchParams, {
									delete: ['_colorId'],
									options: {
										scroll: false,
									},
								})
							}
						/>
					)}

					{!!_sizeId && (
						<TagRefItem
							name={sizes?.find((v) => v._id == (_sizeId as string))?.name!}
							onClean={() =>
								updateQueryParams(router, pathname, searchParams, {
									delete: ['_sizeId'],
									options: {
										scroll: false,
									},
								})
							}
						/>
					)}

					{!!_trademarkId && (
						<TagRefItem
							name={trademarks?.find((v) => v._id == (_trademarkId as string))?.name!}
							onClean={() =>
								updateQueryParams(router, pathname, searchParams, {
									delete: ['_trademarkId'],
									options: {
										scroll: false,
									},
								})
							}
						/>
					)}
				</FlexLayout>
			</div>
		</div>
	);
}

export default SortProduct;
