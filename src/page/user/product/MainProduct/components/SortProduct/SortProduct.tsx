import {ArrowDown2} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useContext, useState} from 'react';
import FlexLayout from '~/components/layout/FlexLayout';
import TagRefItem from '~/components/utils/TagRefItem';
import {ContextProduct, ICatalog, IContextProduct} from '~/contexts/ContextProduct';
import {renderRangePrice} from '~/funcs/convertCoin';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import styles from './SortProduct.module.scss';
import type {PropsSortProduct} from './interfaces';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';
import {optionSorts} from '~/constants/config';
import {BiCheck} from 'react-icons/bi';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import clientServices from '~/services/client.service';
import {httpRequest} from '~/funcs/httpRequest';

function SortProduct({}: PropsSortProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [openSort, setOpenSort] = useState<boolean>(false);

	const {_categoryId, _sizeId, _trademarkId, _priceId, _colorId, _sort, _categoryParentId} = getQueryParams(searchParams);

	const {colors, sizes, trademarks, setupPrices, categorys} = useContext<IContextProduct>(ContextProduct);

	const {data: directSubCategorys = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientDirectSubCategory, _categoryParentId],
		queryFn: () =>
			httpRequest({
				http: clientServices.directSubCategory({category_id: _categoryParentId as string}),
			}),
		enabled: !!_categoryParentId,
	});

	return (
		<div className={styles.main_sort_product}>
			{directSubCategorys?.length > 0 && (
				<div className={styles.tabs_wrapper}>
					<div className={styles.tabs}>
						{directSubCategorys?.map((c) => (
							<div
								key={c?._id}
								className={clsx(styles.tab, {[styles.active]: c._id == (_categoryId as string)})}
								onClick={() =>
									updateQueryParams(router, pathname, searchParams, {
										set: {
											_categoryId: c._id,
										},
										delete: ['_colorId', '_sizeId', '_trademarkId'],
										options: {
											scroll: false,
										},
									})
								}
							>
								{c?.name}
							</div>
						))}
					</div>
				</div>
			)}
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

						{!!_sort && (
							<TagRefItem
								name={optionSorts?.find((v) => v.value == (_sort as string))?.name!}
								onClean={() =>
									updateQueryParams(router, pathname, searchParams, {
										delete: ['_sort'],
										options: {
											scroll: false,
										},
									})
								}
							/>
						)}
					</FlexLayout>
				</div>

				<div className={styles.selected}>
					<p>Sắp xếp:</p>
					<TippyHeadless
						maxWidth={'100%'}
						interactive
						visible={openSort}
						onClickOutside={() => setOpenSort(false)}
						placement='bottom'
						render={() => (
							<div className={styles.option_sort}>
								{optionSorts?.map((v) => (
									<div
										key={v?.value}
										className={clsx(styles.option, {
											[styles.option_active]: (_sort as string) == v.value,
										})}
										onClick={() => {
											setOpenSort(false);
											updateQueryParams(router, pathname, searchParams, {
												set: {_sort: v.value},
												options: {
													scroll: false,
												},
											});
										}}
									>
										<p>{v?.name}</p>
										{(_sort as string) == v.value && (
											<div className={styles.icon_check}>
												<BiCheck fontSize={18} color='#149343' fontWeight={600} />
											</div>
										)}
									</div>
								))}
							</div>
						)}
					>
						<div className={clsx(styles.sort, {[styles.active]: openSort})} onClick={() => setOpenSort(!openSort)}>
							<p>{optionSorts?.find((s) => s.value == (_sort as string))?.name || 'Mặc định'}</p>
							<div className={styles.arrow}>
								<ArrowDown2 size='20' color='#697586' variant='Bold' />
							</div>
						</div>
					</TippyHeadless>
				</div>
			</div>
		</div>
	);
}

export default SortProduct;
