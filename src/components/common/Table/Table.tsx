import {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';
import {PropsTable} from './interfaces';
import {IoIosArrowUp} from 'react-icons/io';
import {FaSortAmountDown, FaSortAmountDownAlt} from 'react-icons/fa';
import {TbArrowsSort} from 'react-icons/tb';

const Table = <T,>({
	data,
	column,
	fixedHeader = false,
	activeHeader = false,
	handleCheckedAll,
	isCheckedAll,
	handleCheckedRow,
	handleIsCheckedRow,
	rowKey,
	getChildren,
	useIndexPathAsKey = false,
	isDisableCheckBox,
}: PropsTable<T>) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const thRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);

	const [isShowScroll, setIsShowScroll] = useState(false);
	const [expandedRows, setExpandedRows] = useState<React.Key[]>([]);
	const [columnWidths, setColumnWidths] = useState<number[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: 'asc' | 'desc' | null;
	}>({key: '', direction: null});

	const handleInternalSort = (key: string) => {
		setSortConfig((prev) => {
			if (prev.key === key) {
				const nextDirection = prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc';
				return {key, direction: nextDirection};
			}
			return {key, direction: 'asc'};
		});
	};

	const sortedData = useMemo(() => {
		if (!sortConfig.key || !sortConfig.direction) return data || [];

		return [...data].sort((a, b) => {
			const aValue = a[sortConfig.key as keyof T];
			const bValue = b[sortConfig.key as keyof T];

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
			}

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}

			return 0;
		});
	}, [data, sortConfig]);

	useEffect(() => {
		const element = tableRef.current;
		if (!element) return;

		const observer = new ResizeObserver(() => {
			setIsShowScroll(element.scrollWidth > element.clientWidth);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	//fixed
	useEffect(() => {
		const updateColumnWidths = () => {
			if (thRefs.current.length > 0) {
				const widths = thRefs.current.map((th) => th?.offsetWidth || 0);
				setColumnWidths(widths);
			}
		};

		updateColumnWidths();
		window.addEventListener('resize', updateColumnWidths);
		return () => {
			window.removeEventListener('resize', updateColumnWidths);
		};
	}, [data]);

	const fixedLeftPositions = useMemo(() => {
		let left = 0;
		return column.map((col, index) => {
			if (col.fixedLeft) {
				const position = left;
				left += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	const fixedRightPositions = useMemo(() => {
		let right = 0;
		return column
			.slice()
			.reverse()
			.map((col, index) => {
				if (col.fixedRight) {
					const position = right;
					right += columnWidths[column.length - 1 - index] || 0;
					return position;
				}
				return null;
			})
			.reverse();
	}, [column, columnWidths]);

	const toggleExpandRow = (key: string | number) => {
		setExpandedRows((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
	};

	const renderRows = (rows: T[], level = 0, indexPath: number[]): React.ReactNode => {
		return rows.map((row, i) => {
			const currentIndexPath = [...indexPath, i];
			const pathKey = currentIndexPath.join('.');
			const uniqueKey = String(useIndexPathAsKey ? pathKey : rowKey(row)); // Nếu có useIndexPathAsKey thì lấy pathKey theo index không thì vẫn lấy key qua rowKey

			const children = getChildren?.(row);
			const isExpanded = expandedRows.includes(uniqueKey);

			return (
				<Fragment key={uniqueKey ? uniqueKey : i}>
					<tr className={clsx(styles.tr_data, {[styles.level]: level > 0, [styles.rowExpanded]: isExpanded})}>
						{getChildren && (
							<td style={{width: 60, minWidth: 60}}>
								{!!children?.length && (
									<div
										className={clsx(styles.arrow, {[styles.expanded]: isExpanded})}
										onClick={() => toggleExpandRow(uniqueKey)}
									>
										<IoIosArrowUp className={styles.icon} size={20} />
									</div>
								)}
							</td>
						)}
						{column.map((col, j) => (
							<td
								key={j}
								className={clsx({
									[styles.fixedLeft]: col.fixedLeft && isShowScroll,
									[styles.fixedRight]: col.fixedRight && isShowScroll,
								})}
								style={{
									left: fixedLeftPositions[j] || 0,
									right: fixedRightPositions[j] || 0,
								}}
							>
								<div
									className={clsx(col.className, {
										[styles.checkBox]: col.checkBox,
									})}
									style={{
										maxWidth: typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth,
										wordBreak: col.maxWidth ? 'break-word' : undefined,
										whiteSpace: col.maxWidth ? 'normal' : undefined,
									}}
								>
									{col.checkBox && (
										<input
											className={clsx(styles.checkbox, {
												[styles.disabled]: isDisableCheckBox?.(row),
											})}
											type='checkbox'
											onChange={(e) => handleCheckedRow?.(e, row)}
											checked={handleIsCheckedRow?.(row) ?? false}
											disabled={isDisableCheckBox?.(row)}
										/>
									)}
									{col.render(row, i, currentIndexPath)}
								</div>
							</td>
						))}
					</tr>
					{isExpanded && children && renderRows(children, level + 1, currentIndexPath)}
				</Fragment>
			);
		});
	};

	return (
		<div
			ref={tableRef}
			className={clsx(styles.container, {
				[styles.fixedHeader]: fixedHeader,
				[styles.activeHeader]: activeHeader,
			})}
		>
			<table>
				<thead>
					<tr>
						{getChildren && <th style={{width: 60}} />}
						{column.map((col, i) => {
							const isSorting = col.sortTable === sortConfig?.key;
							return (
								<th
									key={i}
									ref={(el) => {
										thRefs.current[i] = el;
									}}
									style={{
										left: fixedLeftPositions[i] || 0,
										right: fixedRightPositions[i] || 0,
									}}
									onClick={() => col.sortTable && handleInternalSort(col.sortTable)}
									className={clsx(styles.th_title, {
										[styles.checkBox]: col.checkBox,
										[styles.fixedLeft]: col.fixedLeft && isShowScroll,
										[styles.fixedRight]: col.fixedRight && isShowScroll,
										[styles.activeSort]: isSorting && !!sortConfig?.direction,
									})}
								>
									{col.checkBox && (
										<input
											className={clsx(styles.checkbox, styles.checkbox_head)}
											type='checkbox'
											onChange={handleCheckedAll}
											checked={isCheckedAll}
										/>
									)}
									<div
										className={clsx(styles.title, {
											[styles.sortable]: col.sortTable,
										})}
									>
										{col.title}
										{col.sortTable && (
											<div style={{marginLeft: 4}}>
												{isSorting ? (
													sortConfig?.direction === 'asc' ? (
														<FaSortAmountDownAlt size={14} />
													) : sortConfig?.direction === 'desc' ? (
														<FaSortAmountDown size={14} />
													) : (
														<TbArrowsSort size={14} />
													)
												) : (
													<TbArrowsSort size={14} />
												)}
											</div>
										)}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>{renderRows(sortedData, 0, [])}</tbody>
			</table>
		</div>
	);
};

export default Table;
