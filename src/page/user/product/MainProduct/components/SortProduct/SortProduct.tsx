import {ArrowDown2} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useContext, useState} from 'react';
import FlexLayout from '~/components/layout/FlexLayout';
import TagRefItem from '~/components/utils/TagRefItem';
import {ContextProduct, IContextProduct} from '~/contexts/ContextProduct';
import {renderRangePrice} from '~/funcs/convertCoin';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import styles from './SortProduct.module.scss';
import type {PropsSortProduct} from './interfaces';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';
import {optionSorts} from '~/constants/config';
import {BiCheck} from 'react-icons/bi';

function SortProduct({}: PropsSortProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [openSort, setOpenSort] = useState<boolean>(false);

	const {_categoryId, _sizeId, _trademarkId, _priceId, _colorId, _sort} = getQueryParams(searchParams);
	const {colors, sizes, trademarks, setupPrices, categorys} = useContext<IContextProduct>(ContextProduct);

	return (
		<div className={styles.main_sort_product}>
			<div className={styles.sort_product}>
				{/* Active Filter Tags */}
				<div className={styles.selected}>
					<span className={styles.label_title}>Đang lọc theo:</span>

					{!_categoryId && !_sizeId && !_trademarkId && !_priceId && !_colorId && <TagRefItem name='Tất cả' />}

					<FlexLayout row gap-6 wrap>
						{!!_categoryId && (
							<TagRefItem
								name={categorys?.find((v) => v._id === (_categoryId as string))?.name || 'Danh mục'}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_categoryId', '_categoryParentId', '_page'],
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
									min: setupPrices?.find((v) => v._id === (_priceId as string))?.min || 0,
									max: setupPrices?.find((v) => v._id === (_priceId as string))?.max || 0,
								})}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_priceId', '_page'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}

						{!!_colorId && (
							<TagRefItem
								name={colors?.find((v) => v._id === (_colorId as string))?.name || 'Màu sắc'}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_colorId', '_page'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}

						{!!_sizeId && (
							<TagRefItem
								name={sizes?.find((v) => v._id === (_sizeId as string))?.name || 'Kích cỡ'}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_sizeId', '_page'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}

						{!!_trademarkId && (
							<TagRefItem
								name={trademarks?.find((v) => v._id === (_trademarkId as string))?.name || 'Thương hiệu'}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_trademarkId', '_page'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}

						{!!_sort && (
							<TagRefItem
								name={optionSorts?.find((v) => v.value === (_sort as string))?.name || 'Sắp xếp'}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_sort', '_page'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}
					</FlexLayout>
				</div>

				{/* Sort Dropdown */}
				<div className={styles.sort_box}>
					<span className={styles.label_title}>Sắp xếp:</span>
					<TippyHeadless
						maxWidth={'100%'}
						interactive
						visible={openSort}
						onClickOutside={() => setOpenSort(false)}
						placement='bottom-end'
						render={() => (
							<div className={styles.option_sort}>
								{optionSorts?.map((v) => (
									<div
										key={v?.value}
										className={clsx(styles.option, {
											[styles.option_active]: (_sort as string) === v.value,
										})}
										onClick={() => {
											setOpenSort(false);
											updateQueryParams(router, pathname, searchParams, {
												set: {_sort: v.value},
												delete: ['_page'],
												options: {
													scroll: false,
												},
											});
										}}
									>
										<p>{v?.name}</p>
										{(_sort as string) === v.value && (
											<div className={styles.icon_check}>
												<BiCheck fontSize={18} color='#00b7c4' fontWeight={600} />
											</div>
										)}
									</div>
								))}
							</div>
						)}
					>
						<div className={clsx(styles.sort, {[styles.active]: openSort})} onClick={() => setOpenSort(!openSort)}>
							<p>{optionSorts?.find((s) => s.value === (_sort as string))?.name || 'Mặc định'}</p>
							<div className={styles.arrow}>
								<ArrowDown2 size='16' color='#697586' variant='Bold' />
							</div>
						</div>
					</TippyHeadless>
				</div>
			</div>
		</div>
	);
}

export default SortProduct;
