'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {ArrowLeft2, ArrowRight2, Category2} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import CategoryIcon from '~/components/common/CategoryIcon';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import styles from './CategoryHome.module.scss';
import type {PropsCategoryHome} from './interfaces';
import type {INodeCategory} from '../../product/MainProduct/components/FilterProduct/interfaces';

function CategoryHome({}: PropsCategoryHome) {
	const [activeParentId, setActiveParentId] = useState<string>('all');
	const [subScrollRatio, setSubScrollRatio] = useState(0);
	const [canSubScroll, setCanSubScroll] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [isSingleRow, setIsSingleRow] = useState(false);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	const subScrollRef = useRef<HTMLDivElement>(null);

	const {data: nodes = [], isLoading} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.clientTreeCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.treeCategory(),
			}),
	});

	const handleImageError = (id: string) => {
		setImageErrors((prev) => ({...prev, [id]: true}));
	};

	const getImageUrl = (image?: string | null) => {
		if (!image) return null;
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) return image;
		const base = (process.env.NEXT_PUBLIC_IMAGE || '').replace(/\/+$/, '');
		const path = image.replace(/^\/+/, '');
		return `${base}/${path}`;
	};

	// Level 1 categories (giữ nguyên danh mục cấp 1 cũ)
	const parentCategories = useMemo(() => {
		return nodes.map((node) => ({
			_id: node._id,
			name: node.name,
			image: node.image,
		}));
	}, [nodes]);

	// Level 2 display categories based on selected level 1 parent
	const displayCategories = useMemo(() => {
		if (activeParentId === 'all') {
			// Flatten all level 2 children across all parents
			const list: Array<{_id: string; name: string; image?: string | null}> = [];
			nodes.forEach((parent) => {
				if (parent.children && parent.children.length > 0) {
					parent.children.forEach((child) => {
						list.push({
							_id: child._id,
							name: child.name,
							image: child.image || null,
						});
					});
				} else {
					list.push({
						_id: parent._id,
						name: parent.name,
						image: parent.image || null,
					});
				}
			});
			return list;
		}

		const selectedParent = nodes.find((n) => n._id === activeParentId);
		if (!selectedParent) return [];
		if (selectedParent.children && selectedParent.children.length > 0) {
			return selectedParent.children.map((child) => ({
				_id: child._id,
				name: child.name,
				image: child.image || null,
			}));
		}
		return [{_id: selectedParent._id, name: selectedParent.name, image: selectedParent.image || null}];
	}, [nodes, activeParentId]);

	// Track subcategory scroll progress
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

	// Check whether items fit on a single row
	useEffect(() => {
		const checkLayout = () => {
			if (!subScrollRef.current) return;
			const containerWidth = subScrollRef.current.clientWidth;
			if (!containerWidth) return;

			const isMobile = window.innerWidth <= 768;
			const itemWidth = isMobile ? 78 : 88;
			const gap = isMobile ? 8 : 12;
			const totalItems = displayCategories.length;
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
	}, [displayCategories]);

	useEffect(() => {
		const el = subScrollRef.current;
		if (!el) return;

		handleSubScroll();

		el.addEventListener('scroll', handleSubScroll, {passive: true});

		return () => {
			el.removeEventListener('scroll', handleSubScroll);
		};
	}, [displayCategories, isSingleRow]);

	const handleSelectParent = (parentId: string) => {
		setActiveParentId(parentId);
		if (subScrollRef.current) {
			subScrollRef.current.scrollTo({left: 0, behavior: 'smooth'});
		}
	};

	const handleScrollBy = (direction: 'left' | 'right') => {
		if (!subScrollRef.current) return;
		const delta = subScrollRef.current.clientWidth * 0.75 * (direction === 'left' ? -1 : 1);
		subScrollRef.current.scrollBy({left: delta, behavior: 'smooth'});
	};

	if (!isLoading && nodes.length === 0) {
		return null;
	}

	return (
		<LayoutGrid>
			<section className={styles.category_section}>
				{/* 1. Danh mục cấp 1: Giữ nguyên như cũ với title và parent_tabs */}
				<div className={styles.head}>
					<div className={styles.title_wrap}>
						<div className={styles.title_icon}>
							<Category2 size='20' color='#00b7c4' variant='Bold' />
						</div>
						<h2 className={styles.title_text}>Danh mục sản phẩm</h2>
						{displayCategories.length > 0 && (
							<span className={styles.count_badge}>{displayCategories.length}</span>
						)}
					</div>

					{/* Level 1 Parent Tabs */}
					<div className={styles.parent_tabs}>
						<button
							type='button'
							className={clsx(styles.tab_btn, {[styles.active]: activeParentId === 'all'})}
							onClick={() => handleSelectParent('all')}
						>
							Tất cả
						</button>
						{parentCategories.map((cat) => (
							<button
								key={cat._id}
								type='button'
								className={clsx(styles.tab_btn, {[styles.active]: activeParentId === cat._id})}
								onClick={() => handleSelectParent(cat._id)}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>

				{/* 2. Danh mục cấp 2: Đồng bộ item theo chuẩn /product (lưới 2 hàng CellphoneS, không border/background/box-shadow quanh ảnh) */}
				{displayCategories.length > 0 && (
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
							{displayCategories.map((item) => {
								const hasValidImage = Boolean(item.image) && !imageErrors[item._id];
								const imageUrl = hasValidImage ? getImageUrl(item.image) : null;

								return (
									<Link
										key={item._id}
										href={`${PATH.Product}?_categoryId=${item._id}`}
										className={styles.sub_item}
										title={item.name}
									>
										<div className={styles.sub_thumb_wrap}>
											{imageUrl ? (
												<Image
													src={imageUrl}
													alt={item.name}
													fill
													sizes='56px'
													className={styles.sub_thumb_img}
													onError={() => handleImageError(item._id)}
												/>
											) : (
												<CategoryIcon name={item.name} size={52} />
											)}
										</div>
										<span className={styles.sub_name}>{item.name}</span>
									</Link>
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
			</section>
		</LayoutGrid>
	);
}

export default CategoryHome;
