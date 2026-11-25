import {ArrowDown2} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useContext, useState} from 'react';
import FlexLayout from '~/components/layout/FlexLayout';
import TagRefItem from '~/components/utils/TagRefItem';
import {ContextProduct, IContextProduct} from '~/contexts/ContextProduct';
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

	const {_categoryId, _sizeId, _sort} = getQueryParams(searchParams);
	const {sizes, categorys} = useContext<IContextProduct>(ContextProduct);

	const currentSort = (_sort as string) || '1';

	return (
		<div className={styles.main_sort_product}>
			<div className={styles.sort_product}>
				{/* Active Filter Tags */}
				<div className={styles.selected}>
					<span className={styles.label_title}>Đang lọc theo:</span>

					{!_categoryId && !_sizeId && <TagRefItem name='Tất cả' />}

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

						{!!_sort && _sort !== '1' && (
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
											[styles.option_active]: currentSort === v.value,
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
										{currentSort === v.value && (
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
							<p>{optionSorts?.find((s) => s.value === currentSort)?.name || 'Nổi bật'}</p>
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
