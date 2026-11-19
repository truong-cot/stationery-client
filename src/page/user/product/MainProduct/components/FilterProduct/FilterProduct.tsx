'use client';

import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {ArrowLeft2, ArrowRight2, Category2} from 'iconsax-react';
import Image from 'next/image';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import {IoClose} from 'react-icons/io5';

import CategoryIcon from '~/components/common/CategoryIcon';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import {BiCheck} from 'react-icons/bi';
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

function scrollItemToLeft(container: HTMLElement | null, item: HTMLElement | null, paddingOffset = 24) {
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

	const {_categoryId} = getQueryParams(searchParams);

	// Optimistic category id for 0ms instant UI feedback
	const [currentCategoryId, setCurrentCategoryId] = useState<string | null>((_categoryId as string) || null);

	// Sync with URL search params when changed outside (e.g. Back/Forward or tag clear)
	useEffect(() => {
		setCurrentCategoryId((_categoryId as string) || null);
	}, [_categoryId]);

	const rootScrollRef = useRef<HTMLDivElement>(null);
	const subScrollRef = useRef<HTMLDivElement>(null);
	const rootItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const subItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const [subScrollRatio, setSubScrollRatio] = useState(0);
	const [canSubScroll, setCanSubScroll] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [isSingleRow, setIsSingleRow] = useState(false);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	const handleImageError = (id: string) => {
		setImageErrors((prev) => ({...prev, [id]: true}));
	};

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

	const getImageUrl = (image?: string | null) => {
		if (!image) return null;
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) return image;
		const base = (process.env.NEXT_PUBLIC_IMAGE || '').replace(/\/+$/, '');
		const path = image.replace(/^\/+/, '');
		return `${base}/${path}`;
	};

	// Track scroll position to update CellphoneS-style scroll progress indicator
	const handleSubScroll = () => {
		if (!subScrollRef.current) return;
		const {scrollLeft, scrollWidth, clientWidth} = subScrollRef.current;
		const maxScroll = scrollWidth - clientWidth;
		if (maxScroll > 4) {
			setCanSubScroll(true);
			setCanScrollLeft(scrollLeft > 4);
			setCanScrollRight(scrollLeft < maxScroll - 4);
			setSubScrollRatio(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
		} else {
			setCanSubScroll(false);
			setCanScrollLeft(false);
			setCanScrollRight(false);
		}
	};

	const handleScrollBy = (direction: 'left' | 'right') => {
		if (!subScrollRef.current) return;
		const delta = subScrollRef.current.clientWidth * 0.75 * (direction === 'left' ? -1 : 1);
		subScrollRef.current.scrollBy({left: delta, behavior: 'smooth'});
	};

	// Check whether all subcategories fit on 1 single row without wrapping
	useEffect(() => {
		const checkLayout = () => {
			if (!subScrollRef.current) return;
			const containerWidth = subScrollRef.current.clientWidth;
			if (!containerWidth) return;

			const isMobile = window.innerWidth <= 768;
			const itemWidth = isMobile ? 78 : 88;
			const gap = isMobile ? 8 : 12;
			const totalItems = subCategories.length;
			const neededWidth = totalItems * itemWidth + Math.max(0, totalItems - 1) * gap + (isMobile ? 12 : 16);

			setIsSingleRow(neededWidth <= containerWidth);
		};

		checkLayout();

		const el = subScrollRef.current;
		const resizeObserver = new ResizeObserver(() => {
			checkLayout();
			handleSubScroll();
		});

		if (el) {
			resizeObserver.observe(el);
		}

		window.addEventListener('resize', checkLayout);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', checkLayout);
		};
	}, [subCategories]);

	useEffect(() => {
		const el = subScrollRef.current;
		if (!el) return;

		handleSubScroll();

		el.addEventListener('scroll', handleSubScroll, {passive: true});

		return () => {
			el.removeEventListener('scroll', handleSubScroll);
		};
	}, [subCategories, isSingleRow]);

	// Auto scroll selected parent and child category pills to the left of their scroll containers
	useEffect(() => {
		const activeRootId = activePath[0];
		const rafId = requestAnimationFrame(() => {
			if (!activeRootId) {
				scrollItemToLeft(rootScrollRef.current, null);
				return;
			}

			scrollItemToLeft(rootScrollRef.current, rootItemRefs.current[activeRootId] || null, 16);

			if (subCategories.length > 0) {
				const subTarget =
					currentCategoryId && currentCategoryId !== activeRootId ? subItemRefs.current[currentCategoryId] || null : null;
				scrollItemToLeft(subScrollRef.current, subTarget, 24);
			}
		});

		return () => cancelAnimationFrame(rafId);
	}, [activePath, currentCategoryId, subCategories]);

	// Select / Deselect Root or Category with 0ms optimistic switch
	const handleSelectCategory = (nodeId: string, isRoot: boolean) => {
		const isCurrentlyActive = currentCategoryId === nodeId;

		if (isCurrentlyActive) {
			if (!isRoot && activeRootNode) {
				// Unselect subcategory -> return to parent root category
				setCurrentCategoryId(activeRootNode._id);
				onClose && onClose();
				updateQueryParams(router, pathname, searchParams, {
					set: {
						_categoryId: activeRootNode._id,
						_categoryParentId: activeRootNode._id,
					},
					delete: ['_page'],
					options: {
						scroll: false,
					},
				});
				return;
			}

			// Unselect root category -> return to "All products"
			setCurrentCategoryId(null);
			onClose && onClose();
			updateQueryParams(router, pathname, searchParams, {
				delete: ['_categoryId', '_categoryParentId', '_page'],
				options: {
					scroll: false,
				},
			});
			return;
		}

		// Normal selection
		setCurrentCategoryId(nodeId);
		onClose && onClose();
		updateQueryParams(router, pathname, searchParams, {
			set: {
				_categoryId: nodeId,
				...(isRoot ? {_categoryParentId: nodeId} : {}),
			},
			delete: isRoot ? ['_page'] : ['_categoryParentId', '_page'],
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

				{/* 2. Subcategories tier (CellphoneS style 2-row grid or 1-row if it fits) */}
				{subCategories.length > 0 && (
					<div className={styles.subcategory_container}>
						{canScrollLeft && (
							<button
								type='button'
								className={clsx(styles.nav_btn, styles.nav_prev)}
								onClick={() => handleScrollBy('left')}
								aria-label='Xem danh mục trước'
							>
								<ArrowLeft2 size={16} color='#334155' />
							</button>
						)}

						{canScrollRight && (
							<button
								type='button'
								className={clsx(styles.nav_btn, styles.nav_next)}
								onClick={() => handleScrollBy('right')}
								aria-label='Xem thêm danh mục'
							>
								<ArrowRight2 size={16} color='#334155' />
							</button>
						)}

						<div
							ref={subScrollRef}
							className={clsx(styles.subcategory_scroll, {
								[styles.single_row]: isSingleRow,
							})}
						>
							{/* Subcategory items */}
							{subCategories.map((child) => {
								const isChildActive = currentCategoryId === child._id;
								const hasValidImage = Boolean(child.image) && !imageErrors[child._id];
								const imageUrl = hasValidImage ? getImageUrl(child.image) : null;

								return (
									<button
										key={child._id}
										ref={(el) => {
											subItemRefs.current[child._id] = el;
										}}
										type='button'
										className={clsx(styles.sub_item, {
											[styles.active]: isChildActive,
										})}
										onClick={() => handleSelectCategory(child._id, false)}
										title={child.name}
									>
										{isChildActive && (
											<span className={styles.active_check_badge}>
												<BiCheck size={13} color='#ffffff' />
											</span>
										)}
										<div className={styles.sub_thumb_wrap}>
											{imageUrl ? (
												<Image
													src={imageUrl}
													alt={child.name}
													fill
													sizes='56px'
													className={styles.sub_thumb_img}
													onError={() => handleImageError(child._id)}
												/>
											) : (
												<CategoryIcon name={child.name} size={52} />
											)}
										</div>
										<span className={styles.sub_name}>{child.name}</span>
									</button>
								);
							})}
						</div>

						{/* Scroll Progress Indicator Bar (CellphoneS style) */}
						{canSubScroll && (
							<div className={styles.scroll_indicator_wrap}>
								<div className={styles.scroll_indicator_track}>
									<div
										className={styles.scroll_indicator_thumb}
										style={{
											transform: `translateX(${subScrollRatio * 18}px)`,
										}}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default FilterProduct;
