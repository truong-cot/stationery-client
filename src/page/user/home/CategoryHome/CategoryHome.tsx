'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
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
import {INodeCategory} from '../../product/MainProduct/components/FilterProduct/interfaces';

function getVisibleCols(width: number): number {
	if (width <= 480) return 4;
	if (width <= 768) return 5;
	if (width <= 1024) return 7;
	if (width < 1400) return 10;
	return 12;
}

function CategoryHome({}: PropsCategoryHome) {
	const [activeParentId, setActiveParentId] = useState<string>('all');
	const [visibleCols, setVisibleCols] = useState<number>(10);
	const [scrollState, setScrollState] = useState<{
		canScroll: boolean;
		canScrollLeft: boolean;
		canScrollRight: boolean;
		thumbWidth: number;
		thumbLeft: number;
	}>({
		canScroll: false,
		canScrollLeft: false,
		canScrollRight: false,
		thumbWidth: 35,
		thumbLeft: 0,
	});

	const gridRef = useRef<HTMLDivElement>(null);

	const {data: nodes = [], isLoading} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.clientTreeCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.treeCategory(),
			}),
	});

	useEffect(() => {
		const updateCols = () => {
			setVisibleCols(getVisibleCols(window.innerWidth));
		};
		updateCols();
		window.addEventListener('resize', updateCols);
		return () => window.removeEventListener('resize', updateCols);
	}, []);

	// Level 1 categories
	const parentCategories = useMemo(() => {
		return nodes.map((node) => ({
			_id: node._id,
			name: node.name,
			image: node.image,
		}));
	}, [nodes]);

	// Level 2 categories depending on active parent
	const displayCategories = useMemo(() => {
		if (activeParentId === 'all') {
			// Flatten all level 2 children, only fallback to parent if parent has no children
			const list: Array<{_id: string; name: string; image?: string | null}> = [];
			nodes.forEach((parent) => {
				if (parent.children && parent.children.length > 0) {
					parent.children.forEach((child) => {
						list.push({
							_id: child._id,
							name: child.name,
							image: child.image || null, // DO NOT inherit parent image to avoid wide banner stretching on child icons
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

	const isSingleRow = displayCategories.length > 0 && displayCategories.length <= visibleCols;

	const updateScrollState = useCallback(() => {
		const el = gridRef.current;
		if (!el) return;

		const {scrollLeft, scrollWidth, clientWidth} = el;
		const maxScroll = scrollWidth - clientWidth;

		if (maxScroll <= 4) {
			setScrollState({
				canScroll: false,
				canScrollLeft: false,
				canScrollRight: false,
				thumbWidth: 100,
				thumbLeft: 0,
			});
			return;
		}

		const thumbWidth = Math.max(18, Math.min(80, (clientWidth / scrollWidth) * 100));
		const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
		const thumbLeft = progress * (100 - thumbWidth);

		setScrollState({
			canScroll: true,
			canScrollLeft: scrollLeft > 4,
			canScrollRight: scrollLeft < maxScroll - 4,
			thumbWidth,
			thumbLeft,
		});
	}, []);

	useEffect(() => {
		const rafId = requestAnimationFrame(updateScrollState);
		return () => cancelAnimationFrame(rafId);
	}, [displayCategories, visibleCols, updateScrollState]);

	const handleSelectParent = (parentId: string) => {
		setActiveParentId(parentId);
		if (gridRef.current) {
			gridRef.current.scrollTo({left: 0});
		}
	};

	const handleScrollBy = (direction: 'left' | 'right') => {
		const el = gridRef.current;
		if (!el) return;
		const delta = el.clientWidth * 0.75 * (direction === 'left' ? -1 : 1);
		el.scrollBy({left: delta, behavior: 'smooth'});
	};

	if (!isLoading && nodes.length === 0) {
		return null;
	}

	return (
		<LayoutGrid>
			<section className={styles.category_section}>
				{/* Section Header */}
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

				{/* Category Items 2-Row Horizontal Scroll Container */}
				<div className={styles.category_container}>
					{scrollState.canScrollLeft && (
						<button
							type='button'
							className={clsx(styles.nav_btn, styles.nav_prev)}
							onClick={() => handleScrollBy('left')}
							aria-label='Xem danh mục trước'
						>
							<ArrowLeft2 size={16} color='#334155' />
						</button>
					)}

					{scrollState.canScrollRight && (
						<button
							type='button'
							className={clsx(styles.nav_btn, styles.nav_next)}
							onClick={() => handleScrollBy('right')}
							aria-label='Xem thêm danh mục'
						>
							<ArrowRight2 size={16} color='#334155' />
						</button>
					)}

					{isLoading ? (
						<div className={styles.category_grid}>
							{Array.from({length: visibleCols * 2}).map((_, idx) => (
								<div key={idx} className={styles.skeleton_card}>
									<div className={styles.skeleton_icon} />
									<div className={styles.skeleton_text} />
								</div>
							))}
						</div>
					) : (
						<div
							ref={gridRef}
							onScroll={updateScrollState}
							className={clsx(styles.category_grid, {
								[styles.single_row]: isSingleRow,
							})}
						>
							{displayCategories.map((item) => (
								<Link
									key={item._id}
									href={`${PATH.Product}?_categoryId=${item._id}`}
									className={styles.category_card}
								>
									<div className={styles.icon_box}>
										<CategoryIcon
											name={item.name}
											image={item.image}
											size={52}
											className={styles.cat_icon}
										/>
									</div>
									<span className={styles.category_name} title={item.name}>
										{item.name}
									</span>
								</Link>
							))}
						</div>
					)}

					{scrollState.canScroll && (
						<div className={styles.scroll_indicator_wrap} aria-hidden='true'>
							<div className={styles.scroll_track}>
								<div
									className={styles.scroll_thumb}
									style={{
										width: `${scrollState.thumbWidth}%`,
										left: `${scrollState.thumbLeft}%`,
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</section>
		</LayoutGrid>
	);
}

export default CategoryHome;
