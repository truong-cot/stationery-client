import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {ArrowDown2, ArrowRight2} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useContext, useEffect, useMemo, useState} from 'react';
import FlexLayout from '~/components/layout/FlexLayout';
import {QUERY_KEY} from '~/constants/config/enum';
import {ContextProduct, IContextProduct} from '~/contexts/ContextProduct';
import {renderRangePrice} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import styles from './FilterProduct.module.scss';
import type {INodeCategory, PropsFilterProduct} from './interfaces';
import {IoClose} from 'react-icons/io5';

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

function FilterProduct({onClose}: PropsFilterProduct) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {_categoryId, _sizeId, _trademarkId, _priceId, _colorId} = getQueryParams(searchParams);

	const {colors, sizes, trademarks, setupPrices} = useContext<IContextProduct>(ContextProduct);

	const {data: nodes = []} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.clientTreeCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.treeCategory(),
			}),
	});

	const activePath = useMemo(() => {
		if (!_categoryId) return [];
		return findPath(nodes, _categoryId as string) || [];
	}, [nodes, _categoryId]);

	return (
		<div className={clsx(styles.filter_product, {[styles.mobile]: !!onClose})}>
			{onClose && (
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#8492A6' />
				</div>
			)}

			<div className={styles.group}>
				<div className={styles.head}>
					<h4>Danh mục sản phẩm</h4>
				</div>
				{/* Cây danh mục */}
				{nodes?.map((node) => (
					<NodeCategory key={node._id} level={0} node={node} activePath={activePath} onClose={onClose} />
				))}
			</div>

			{setupPrices.length > 0 && (
				<div className={styles.group}>
					<div className={styles.head}>
						<h4>Giá sản phẩm</h4>
					</div>

					{/* Danh sách khoảng giá */}
					{setupPrices?.map((p) => (
						<div
							key={p._id}
							className={styles.filter_item}
							onClick={() => {
								onClose && onClose();
								updateQueryParams(router, pathname, searchParams, {
									...((_priceId as string) == p._id
										? {
												delete: ['_priceId'],
											}
										: {
												set: {
													_priceId: p._id,
												},
											}),
									options: {
										scroll: false,
									},
								});
							}}
						>
							<input id={`setup-price-${p._id}`} type='checkbox' name='setup-price' checked={(_priceId as string) == p._id} />
							<label htmlFor={`setup-price-${p._id}`}>{renderRangePrice({min: p.min, max: p.max})}</label>
						</div>
					))}
				</div>
			)}

			{colors.length > 0 && (
				<div className={styles.group}>
					<div className={styles.head}>
						<h4>Màu sắc sản phẩm</h4>
					</div>

					{/* Danh sách màu sắc */}
					<FlexLayout row gap-6 wrap>
						{colors?.map((c) => (
							<div
								key={c._id}
								style={{background: c?.code}}
								className={styles.color}
								onClick={() => {
									onClose && onClose();
									updateQueryParams(router, pathname, searchParams, {
										...((_colorId as string) == c._id
											? {
													delete: ['_colorId'],
												}
											: {
													set: {
														_colorId: c._id,
													},
												}),
										options: {
											scroll: false,
										},
									});
								}}
							></div>
						))}
					</FlexLayout>
				</div>
			)}

			{sizes.length > 0 && (
				<div className={styles.group}>
					<div className={styles.head}>
						<h4>Kích cỡ sản phẩm</h4>
					</div>

					{/* Danh sách kích cỡ */}
					{sizes?.map((s) => (
						<div
							key={s._id}
							className={styles.filter_item}
							onClick={() => {
								onClose && onClose();
								updateQueryParams(router, pathname, searchParams, {
									...((_sizeId as string) == s._id
										? {
												delete: ['_sizeId'],
											}
										: {
												set: {
													_sizeId: s._id,
												},
											}),
									options: {
										scroll: false,
									},
								});
							}}
						>
							<input id={`size-${s._id}`} type='checkbox' name='size' checked={(_sizeId as string) == s._id} />
							<label htmlFor={`size-${s._id}`}>{s.name}</label>
						</div>
					))}
				</div>
			)}

			{trademarks.length > 0 && (
				<div className={styles.group}>
					<div className={styles.head}>
						<h4>Thương hiệu sản phẩm</h4>
					</div>

					{/* Danh sách thương hiệu */}
					{trademarks?.map((t) => (
						<div
							key={t._id}
							className={styles.filter_item}
							onClick={() => {
								onClose && onClose();
								updateQueryParams(router, pathname, searchParams, {
									...((_trademarkId as string) == t._id
										? {
												delete: ['_trademarkId'],
											}
										: {
												set: {
													_trademarkId: t._id,
												},
											}),
									options: {
										scroll: false,
									},
								});
							}}
						>
							<input id={`trademark-${t._id}`} type='checkbox' name='trademark' checked={(_trademarkId as string) == t._id} />
							<label htmlFor={`trademark-${t._id}`}>{t.name}</label>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default FilterProduct;

function NodeCategory({
	level,
	node,
	activePath,
	onClose,
}: {
	level: number;
	node: INodeCategory;
	activePath: string[];
	onClose?: () => void;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {_categoryId} = getQueryParams(searchParams);

	const isRoot = level === 0;
	const isActive = activePath.includes(node._id);

	const [open, setOpen] = useState<boolean>(level <= 0 || isActive);

	useEffect(() => {
		if (isActive) setOpen(true);
	}, [isActive]);

	return (
		<Fragment>
			<div
				style={{marginLeft: `${level * 16}px`}}
				className={clsx(styles.node_category, {
					[styles.active]: isActive,
				})}
			>
				{node.children.length > 0 ? (
					<div className={styles.expanded} onClick={() => setOpen(!open)}>
						{open ? (
							<ArrowDown2 size='24' color='#697586' variant='Bold' />
						) : (
							<ArrowRight2 size='24' color='#697586' variant='Bold' />
						)}
					</div>
				) : (
					<div
						style={{
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							background: '#697586',
						}}
					/>
				)}
				<p
					className={styles.node_name}
					onClick={() => {
						onClose && onClose();
						updateQueryParams(router, pathname, searchParams, {
							...((_categoryId as string) == node._id
								? {
										delete: ['_categoryId', '_categoryParentId', '_colorId', '_sizeId', '_trademarkId'],
									}
								: {
										set: {
											_categoryId: node._id,
											...(isRoot ? {_categoryParentId: node._id} : {}),
										},
										...(!isRoot ? {delete: ['_categoryParentId']} : {}),
									}),
							options: {
								scroll: false,
							},
						});
					}}
				>
					{node.name}
				</p>
			</div>

			{open &&
				node.children?.map((child) => (
					<NodeCategory key={child._id} level={level + 1} node={child} activePath={activePath} onClose={onClose} />
				))}
		</Fragment>
	);
}
