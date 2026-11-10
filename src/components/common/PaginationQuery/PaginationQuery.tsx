'use client';

import {useEffect, useMemo, useRef} from 'react';
import styles from './PaginationQuery.module.scss';
import clsx from 'clsx';
import {IoArrowBackOutline, IoArrowForwardOutline} from 'react-icons/io5';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {updateQueryParams} from '~/funcs/queryParams';

interface PropsPaginationQuery {
	total: number;
	currentPage: number;
	pageSize?: number;
	dependencies?: React.DependencyList;
}

export const LIMIT = 40;

function PaginationQuery({total, currentPage, pageSize = LIMIT, dependencies = []}: PropsPaginationQuery) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const maxPage = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

	const changePage = (page: number) => {
		updateQueryParams(router, pathname, searchParams, {
			set: {_page: page},
			options: {scroll: false},
		});

		if (typeof window !== 'undefined') {
			window.scrollTo({
				top: 300,
				behavior: 'smooth',
			});
		}
	};

	const isMounted = useRef(false);
	const prevDepsRef = useRef(dependencies);

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			prevDepsRef.current = dependencies;
			return;
		}

		// Only reset page to 1 when a filter dependency actually changes
		const prevDeps = prevDepsRef.current;
		const hasChanged =
			dependencies.length !== prevDeps.length ||
			dependencies.some((dep, i) => !Object.is(dep, prevDeps[i]));

		if (hasChanged) {
			prevDepsRef.current = dependencies;
			if (currentPage !== 1) {
				changePage(1);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	// Safeguard: if totalCount reduced and currentPage > maxPage, reset to page 1
	useEffect(() => {
		if (maxPage > 0 && currentPage > maxPage) {
			changePage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, maxPage]);

	const pages = useMemo(() => {
		const result: (number | 'dots')[] = [];

		if (maxPage <= 7) {
			for (let i = 1; i <= maxPage; i++) result.push(i);
			return result;
		}

		result.push(1);

		if (currentPage > 3) result.push('dots');

		for (let i = currentPage - 1; i <= currentPage + 1; i++) {
			if (i > 1 && i < maxPage) result.push(i);
		}

		if (currentPage < maxPage - 2) result.push('dots');

		result.push(maxPage);

		return result;
	}, [currentPage, maxPage]);

	const handlePrev = () => {
		if (currentPage > 1) changePage(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < maxPage) changePage(currentPage + 1);
	};

	if (total <= pageSize) return null;

	return (
		<div className={styles.container}>
			<ul className={styles.pages}>
				{currentPage > 1 && (
					<button type='button' aria-label='Trang trước' className={clsx(styles.btn, styles.left)} onClick={handlePrev}>
						<IoArrowBackOutline />
					</button>
				)}

				{pages.map((p, index) =>
					p === 'dots' ? (
						<li key={`dots-${index}`} className={styles.item}>
							...
						</li>
					) : (
						<li
							key={p}
							className={clsx(styles.item, {
								[styles.active]: p === currentPage,
							})}
							onClick={() => changePage(p)}
						>
							{p}
						</li>
					)
				)}

				{currentPage < maxPage && (
					<button type='button' aria-label='Trang sau' className={clsx(styles.btn, styles.right)} onClick={handleNext}>
						<IoArrowForwardOutline />
					</button>
				)}
			</ul>
		</div>
	);
}

export default PaginationQuery;
