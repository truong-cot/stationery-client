'use client';

import {useEffect, useMemo} from 'react';
import styles from './PaginationQuery.module.scss';
import clsx from 'clsx';
import {IoArrowBackOutline, IoArrowForwardOutline} from 'react-icons/io5';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {updateQueryParams} from '~/funcs/queryParams';

interface PropsPaginationQuery {
	total: number;
	currentPage: number;
	dependencies?: React.DependencyList;
}

export const LIMIT = 16;

function PaginationQuery({total, currentPage, dependencies = []}: PropsPaginationQuery) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const maxPage = useMemo(() => Math.ceil(total / LIMIT), [total]);

	const changePage = (page: number) => {
		updateQueryParams(router, pathname, searchParams, {
			set: {_page: page},
			options: {scroll: false},
		});
	};

	useEffect(() => {
		if (currentPage !== 1) {
			changePage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

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

	if (total <= LIMIT) return null;

	return (
		<div className={styles.container}>
			<div className={styles.pages}>
				{currentPage > 1 && (
					<button className={clsx(styles.btn, styles.left)} onClick={handlePrev}>
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
					<button className={clsx(styles.btn, styles.right)} onClick={handleNext}>
						<IoArrowForwardOutline />
					</button>
				)}
			</div>
		</div>
	);
}

export default PaginationQuery;
