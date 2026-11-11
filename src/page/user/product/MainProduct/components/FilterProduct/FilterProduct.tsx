'use client';

import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {ArrowDown2, Category2, Money, Colorfilter, Size, TriangleLogo} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import {BiCheck} from 'react-icons/bi';
import {IoClose} from 'react-icons/io5';
import {RiRestartLine} from 'react-icons/ri';

import CategoryIcon from '~/components/common/CategoryIcon';
import {QUERY_KEY} from '~/constants/config/enum';
import {ContextProduct, IContextProduct} from '~/contexts/ContextProduct';
import {renderRangePrice} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import styles from './FilterProduct.module.scss';
import type {INodeCategory, PropsFilterProduct} from './interfaces';

function findPath(nodes: INodeCategory[], targetId: string, path: string[] = []): string[] | null {
	for (const node of nodes) {
		const newPath = [...path, node._id];

		if (node._id === targetId) {
			return newPath;
		}

		if (node.children?.length) {
			const found = findPath(node.children, targetId, newPath);
			if (found) return found;
		}
	}

	return null;
}

function scrollItemToLeft(container: HTMLElement | null, item: HTMLElement | null, paddingOffset = 2) {
	if (!container) return;
	if (!item) {
		container.scrollTo({left: 0, behavior: 'smooth'});
		return;
	}

	const containerRect = container.getBoundingClientRect();
	const itemRect = item.getBoundingClientRect();
	const targetScrollLeft = container.scrollLeft + (itemRect.left - containerRect.left) - paddingOffset;

	container.scrollTo({
		left: Math.max(0, targetScrollLeft),
		behavior: 'smooth',
	});
}

function FilterProduct({onClose}: PropsFilterProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {_categoryId, _sizeId, _trademarkId, _priceId, _colorId} = getQueryParams(searchParams);
	const {colors, sizes, trademarks, setupPrices} = useContext<IContextProduct>(ContextProduct);

	// Optimistic category id for 0ms instant UI feedback
	const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
		(_categoryId as string) || null
	);

	// Sync with URL search params when changed outside (e.g. Back/Forward or tag clear)
	useEffect(() => {
		setCurrentCategoryId((_categoryId as string) || null);
	}, [_categoryId]);

	const [openDropdown, setOpenDropdown] = useState<'price' | 'trademark' | 'size' | 'color' | null>(null);

	const rootScrollRef = useRef<HTMLDivElement>(null);
	const subScrollRef = useRef<HTMLDivElement>(null);
	const rootItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const subItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const {data: nodes = []} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.clientTreeCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.treeCategory(),
			}),
	});

	// Find the hierarchy path of selected category using instant optimistic state
	const activePath = useMemo(() => {
		if (!currentCategoryId) return [];
		return findPath(nodes, currentCategoryId) || [];
	}, [nodes, currentCategoryId]);

	// Find active root category if any
	const activeRootNode = useMemo(() => {
		if (!activePath.length) return null;
		return nodes.find((n) => n._id === activePath[0]) || null;
	}, [nodes, activePath]);

	// Subcategories of active root category
	const subCategories = useMemo(() => {
		return activeRootNode?.children || [];
	}, [activeRootNode]);

	// Auto scroll selected parent and child category pills to the left of their scroll containers
	useEffect(() => {
		const activeRootId = activePath[0];
		const rafId = requestAnimationFrame(() => {
			if (!activeRootId) {
				scrollItemToLeft(rootScrollRef.current, null);
				return;
			}

			scrollItemToLeft(rootScrollRef.current, rootItemRefs.current[activeRootId] || null, 2);

			if (subCategories.length > 0) {
				const subTarget =
					currentCategoryId && currentCategoryId !== activeRootId
						? subItemRefs.current[currentCategoryId] || null
						: null;
				scrollItemToLeft(subScrollRef.current, subTarget, 0);
			}
		});

		return () => cancelAnimationFrame(rafId);
	}, [activePath, currentCategoryId, subCategories]);

	// Active attribute objects for display labels
	const activePrice = useMemo(() => {
		return setupPrices?.find((p) => p._id === (_priceId as string)) || null;
	}, [setupPrices, _priceId]);

	const activeTrademark = useMemo(() => {
		return trademarks?.find((t) => t._id === (_trademarkId as string)) || null;
	}, [trademarks, _trademarkId]);

	const activeSize = useMemo(() => {
		return sizes?.find((s) => s._id === (_sizeId as string)) || null;
	}, [sizes, _sizeId]);

	const activeColor = useMemo(() => {
		return colors?.find((c) => c._id === (_colorId as string)) || null;
	}, [colors, _colorId]);

	const hasAnyFilter = Boolean(currentCategoryId || _priceId || _colorId || _sizeId || _trademarkId);

	// Select / Deselect Root or Category with 0ms optimistic switch
	const handleSelectCategory = (nodeId: string, isRoot: boolean) => {
		const isCurrentlyActive = currentCategoryId === nodeId;
		const nextCategoryId = isCurrentlyActive ? null : nodeId;

		// 1. Instant optimistic update
		setCurrentCategoryId(nextCategoryId);

		onClose && onClose();

		// 2. Sync URL query params
		updateQueryParams(router, pathname, searchParams, {
			...(isCurrentlyActive
				? {
						delete: ['_categoryId', '_categoryParentId', '_page'],
					}
				: {
						set: {
							_categoryId: nodeId,
							...(isRoot ? {_categoryParentId: nodeId} : {}),
						},
						delete: isRoot ? ['_page'] : ['_categoryParentId', '_page'],
					}),
			options: {
				scroll: false,
			},
		});
	};

	// Reset all categories to "All"
	const handleSelectAll = () => {
		setCurrentCategoryId(null);
		onClose && onClose();
		updateQueryParams(router, pathname, searchParams, {
			delete: ['_categoryId', '_categoryParentId', '_page'],
			options: {
				scroll: false,
			},
		});
	};

	// Reset all filters
	const handleResetAllFilters = () => {
		setCurrentCategoryId(null);
		onClose && onClose();
		setOpenDropdown(null);
		updateQueryParams(router, pathname, searchParams, {
			delete: ['_categoryId', '_categoryParentId', '_colorId', '_sizeId', '_trademarkId', '_priceId', '_page'],
			options: {
				scroll: false,
			},
		});
	};

	// Toggle Price
	const handleTogglePrice = (priceId: string) => {
		onClose && onClose();
		setOpenDropdown(null);
		updateQueryParams(router, pathname, searchParams, {
			...((_priceId as string) === priceId
				? {
						delete: ['_priceId', '_page'],
					}
				: {
						set: {
							_priceId: priceId,
						},
						delete: ['_page'],
					}),
			options: {
				scroll: false,
			},
		});
	};

	// Toggle Trademark
	const handleToggleTrademark = (trademarkId: string) => {
		onClose && onClose();
		setOpenDropdown(null);
		updateQueryParams(router, pathname, searchParams, {
			...((_trademarkId as string) === trademarkId
				? {
						delete: ['_trademarkId', '_page'],
					}
				: {
						set: {
							_trademarkId: trademarkId,
						},
						delete: ['_page'],
					}),
			options: {
				scroll: false,
			},
		});
	};

	// Toggle Size
	const handleToggleSize = (sizeId: string) => {
		onClose && onClose();
		setOpenDropdown(null);
		updateQueryParams(router, pathname, searchParams, {
			...((_sizeId as string) === sizeId
				? {
						delete: ['_sizeId', '_page'],
					}
				: {
						set: {
							_sizeId: sizeId,
						},
						delete: ['_page'],
					}),
			options: {
				scroll: false,
			},
		});
	};

	// Toggle Color
	const handleToggleColor = (colorId: string) => {
		onClose && onClose();
		setOpenDropdown(null);
		updateQueryParams(router, pathname, searchParams, {
			...((_colorId as string) === colorId
				? {
						delete: ['_colorId', '_page'],
					}
				: {
						set: {
							_colorId: colorId,
						},
						delete: ['_page'],
					}),
			options: {
				scroll: false,
			},
		});
	};

	return (
		<div className={styles.filter_wrapper}>
			{/* Close button if rendered in drawer */}
			{onClose && (
				<button type='button' aria-label='Đóng bộ lọc' className={styles.close_btn} onClick={onClose}>
					<IoClose size={24} />
				</button>
			)}

			{/* 1. Category Section */}
			<div className={styles.category_section}>
				<div className={styles.section_title_row}>
					<div className={styles.title_group}>
						<Category2 size={18} color='#00b7c4' variant='Bold' />
						<span className={styles.section_title}>Danh mục sản phẩm</span>
					</div>
					{currentCategoryId && (
						<button type='button' className={styles.reset_category_btn} onClick={handleSelectAll}>
							Xem tất cả danh mục
						</button>
					)}
				</div>

				{/* Primary Root Categories with Horizontal Scroll on Mobile */}
				<div className={styles.category_scroll_container}>
					<div ref={rootScrollRef} className={styles.category_scroll}>
						{/* "All" category pill */}
						<button
							type='button'
							className={clsx(styles.category_pill, {
								[styles.active]: !currentCategoryId,
							})}
							onClick={handleSelectAll}
						>
							<div className={styles.pill_thumb}>
								<CategoryIcon name='Tất cả sản phẩm' size={24} />
							</div>
							<span className={styles.pill_name}>Tất cả sản phẩm</span>
						</button>

						{/* Root category pills */}
						{nodes?.map((node) => {
							const isRootActive = activePath[0] === node._id;
							return (
								<button
									key={node._id}
									ref={(el) => {
										rootItemRefs.current[node._id] = el;
									}}
									type='button'
									className={clsx(styles.category_pill, {
										[styles.active]: isRootActive,
									})}
									onClick={() => handleSelectCategory(node._id, true)}
								>
									<div className={styles.pill_thumb}>
										<CategoryIcon name={node.name} size={24} />
									</div>
									<span className={styles.pill_name}>{node.name}</span>
									{node.children && node.children.length > 0 && (
										<span className={styles.badge_count}>{node.children.length}</span>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* 2. Subcategories tier (if selected parent has children) */}
				{subCategories.length > 0 && (
					<div className={styles.subcategory_container}>
						<div ref={subScrollRef} className={styles.subcategory_scroll}>
							<button
								type='button'
								className={clsx(styles.sub_pill, {
									[styles.active]: currentCategoryId === activeRootNode?._id,
								})}
								onClick={() => handleSelectCategory(activeRootNode!._id, true)}
							>
								<div className={styles.sub_thumb}>
									<CategoryIcon name='Tất cả' size={18} />
								</div>
								<span>Tất cả</span>
							</button>

							{subCategories.map((child) => {
								const isChildActive = currentCategoryId === child._id;
								return (
									<button
										key={child._id}
										ref={(el) => {
											subItemRefs.current[child._id] = el;
										}}
										type='button'
										className={clsx(styles.sub_pill, {
											[styles.active]: isChildActive,
										})}
										onClick={() => handleSelectCategory(child._id, false)}
									>
										<div className={styles.sub_thumb}>
											<CategoryIcon name={child.name} size={18} />
										</div>
										<span>{child.name}</span>
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* 3. Attribute Filters Bar (Khoảng giá, Thương hiệu, Kích cỡ, Màu sắc) */}
			{(setupPrices.length > 0 || trademarks.length > 0 || sizes.length > 0 || colors.length > 0) && (
				<div className={styles.attribute_bar}>
					<span className={styles.attr_bar_label}>Bộ lọc:</span>

					<div className={styles.attr_pills_scroll}>
						{/* Price Filter Dropdown */}
						{setupPrices.length > 0 && (
							<TippyHeadless
								interactive
								visible={openDropdown === 'price'}
								onClickOutside={() => setOpenDropdown(null)}
								placement='bottom-start'
								render={() => (
									<div className={styles.dropdown_card}>
										<div className={styles.dropdown_header}>
											<span>Khoảng giá</span>
											{_priceId && (
												<button
													type='button'
													onClick={() => handleTogglePrice(_priceId as string)}
													className={styles.dropdown_clear}
												>
													Bỏ chọn
												</button>
											)}
										</div>
										<div className={styles.dropdown_list}>
											{setupPrices.map((p) => {
												const isSelected = (_priceId as string) === p._id;
												return (
													<button
														key={p._id}
														type='button'
														className={clsx(styles.dropdown_item, {
															[styles.item_active]: isSelected,
														})}
														onClick={() => handleTogglePrice(p._id)}
													>
														<span>{renderRangePrice({min: p.min, max: p.max})}</span>
														{isSelected && <BiCheck size={16} color='#00b7c4' />}
													</button>
												);
											})}
										</div>
									</div>
								)}
							>
								<button
									type='button'
									className={clsx(styles.filter_btn, {
										[styles.active]: Boolean(_priceId),
									})}
									onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
								>
									<Money size={14} variant='Bold' />
									<span>
										{activePrice
											? renderRangePrice({min: activePrice.min, max: activePrice.max})
											: 'Khoảng giá'}
									</span>
									<ArrowDown2 size={12} className={clsx({[styles.rotate]: openDropdown === 'price'})} />
								</button>
							</TippyHeadless>
						)}

						{/* Trademark Filter Dropdown */}
						{trademarks.length > 0 && (
							<TippyHeadless
								interactive
								visible={openDropdown === 'trademark'}
								onClickOutside={() => setOpenDropdown(null)}
								placement='bottom-start'
								render={() => (
									<div className={styles.dropdown_card}>
										<div className={styles.dropdown_header}>
											<span>Thương hiệu</span>
											{_trademarkId && (
												<button
													type='button'
													onClick={() => handleToggleTrademark(_trademarkId as string)}
													className={styles.dropdown_clear}
												>
													Bỏ chọn
												</button>
											)}
										</div>
										<div className={styles.dropdown_list}>
											{trademarks.map((t) => {
												const isSelected = (_trademarkId as string) === t._id;
												return (
													<button
														key={t._id}
														type='button'
														className={clsx(styles.dropdown_item, {
															[styles.item_active]: isSelected,
														})}
														onClick={() => handleToggleTrademark(t._id)}
													>
														<span>{t.name}</span>
														{isSelected && <BiCheck size={16} color='#00b7c4' />}
													</button>
												);
											})}
										</div>
									</div>
								)}
							>
								<button
									type='button'
									className={clsx(styles.filter_btn, {
										[styles.active]: Boolean(_trademarkId),
									})}
									onClick={() => setOpenDropdown(openDropdown === 'trademark' ? null : 'trademark')}
								>
									<TriangleLogo size={14} variant='Bold' />
									<span>{activeTrademark ? activeTrademark.name : 'Thương hiệu'}</span>
									<ArrowDown2 size={12} className={clsx({[styles.rotate]: openDropdown === 'trademark'})} />
								</button>
							</TippyHeadless>
						)}

						{/* Size Filter Dropdown */}
						{sizes.length > 0 && (
							<TippyHeadless
								interactive
								visible={openDropdown === 'size'}
								onClickOutside={() => setOpenDropdown(null)}
								placement='bottom-start'
								render={() => (
									<div className={styles.dropdown_card}>
										<div className={styles.dropdown_header}>
											<span>Kích cỡ</span>
											{_sizeId && (
												<button
													type='button'
													onClick={() => handleToggleSize(_sizeId as string)}
													className={styles.dropdown_clear}
												>
													Bỏ chọn
												</button>
											)}
										</div>
										<div className={styles.dropdown_chips}>
											{sizes.map((s) => {
												const isSelected = (_sizeId as string) === s._id;
												return (
													<button
														key={s._id}
														type='button'
														className={clsx(styles.chip_item, {
															[styles.chip_active]: isSelected,
														})}
														onClick={() => handleToggleSize(s._id)}
													>
														{s.name}
													</button>
												);
											})}
										</div>
									</div>
								)}
							>
								<button
									type='button'
									className={clsx(styles.filter_btn, {
										[styles.active]: Boolean(_sizeId),
									})}
									onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
								>
									<Size size={14} variant='Bold' />
									<span>{activeSize ? activeSize.name : 'Kích cỡ'}</span>
									<ArrowDown2 size={12} className={clsx({[styles.rotate]: openDropdown === 'size'})} />
								</button>
							</TippyHeadless>
						)}

						{/* Color Filter Dropdown */}
						{colors.length > 0 && (
							<TippyHeadless
								interactive
								visible={openDropdown === 'color'}
								onClickOutside={() => setOpenDropdown(null)}
								placement='bottom-start'
								render={() => (
									<div className={styles.dropdown_card}>
										<div className={styles.dropdown_header}>
											<span>Màu sắc</span>
											{_colorId && (
												<button
													type='button'
													onClick={() => handleToggleColor(_colorId as string)}
													className={styles.dropdown_clear}
												>
													Bỏ chọn
												</button>
											)}
										</div>
										<div className={styles.dropdown_colors}>
											{colors.map((c) => {
												const isSelected = (_colorId as string) === c._id;
												return (
													<button
														key={c._id}
														type='button'
														className={clsx(styles.color_item, {
															[styles.color_active]: isSelected,
														})}
														onClick={() => handleToggleColor(c._id)}
														title={c.name}
													>
														<span
															className={styles.color_dot}
															style={{background: c.code || '#ddd'}}
														/>
														<span className={styles.color_name}>{c.name}</span>
														{isSelected && <BiCheck size={14} color='#00b7c4' />}
													</button>
												);
											})}
										</div>
									</div>
								)}
							>
								<button
									type='button'
									className={clsx(styles.filter_btn, {
										[styles.active]: Boolean(_colorId),
									})}
									onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
								>
									<Colorfilter size={14} variant='Bold' />
									<span>{activeColor ? activeColor.name : 'Màu sắc'}</span>
									<ArrowDown2 size={12} className={clsx({[styles.rotate]: openDropdown === 'color'})} />
								</button>
							</TippyHeadless>
						)}

						{/* Reset all filters button */}
						{hasAnyFilter && (
							<button type='button' className={styles.reset_all_btn} onClick={handleResetAllFilters}>
								<RiRestartLine size={14} />
								<span>Xóa tất cả</span>
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default FilterProduct;
