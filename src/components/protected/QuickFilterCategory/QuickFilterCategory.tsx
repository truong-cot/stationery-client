'use client';

import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {Category2, SearchNormal1, TickCircle} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import CategoryIcon from '~/components/common/CategoryIcon';
import Popup from '~/components/common/Popup';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {ICatalog} from '~/contexts/ContextProduct';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams} from '~/funcs/queryParams';
import clientServices from '~/services/client.service';
import styles from './QuickFilterCategory.module.scss';
import type {PropsQuickFilterCategory} from './interfaces';

function QuickFilterCategory({}: PropsQuickFilterCategory) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const pathname = usePathname();

	const {_categoryParentId} = getQueryParams(searchParams);

	const showRoutes = [PATH.Home];

	const isShowRoute = showRoutes.some((route) => (route === '/' ? pathname === '/' : pathname.startsWith(route)));

	const [open, setOpen] = useState<boolean>(false);
	const [categoryId, setCategoryId] = useState<string>('');

	useEffect(() => {
		if (isShowRoute) {
			setOpen(true);
		}
	}, [isShowRoute]);

	useEffect(() => {
		if (!!_categoryParentId) {
			setCategoryId(_categoryParentId as string);
		}
	}, [_categoryParentId]);

	const {data: categorys = []} = useQuery<ICatalog[]>({
		queryKey: [QUERY_KEY.clientCatalogCategoryParent],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogCategoryParent(),
			}),
	});

	const handleQuickFilterCategory = () => {
		const params = new URLSearchParams();

		if (categoryId) {
			params.set('_categoryParentId', categoryId);
			params.set('_categoryId', categoryId);
		}

		const query = params.toString();

		setOpen(false);
		router.push(query ? `${PATH.Product}?${query}` : PATH.Product);
		return;
	};

	const handleSelectCategory = (id: string) => {
		setCategoryId((prev) => (prev === id ? '' : id));
	};

	return (
		<Popup open={open} onClose={() => setOpen(false)}>
			<div className={styles.quick_filter_category}>
				<div className={styles.header}>
					<div className={styles.header_left}>
						<div className={styles.header_icon}>
							<Category2 size='22' color='#00b7c4' variant='Bold' />
						</div>
						<div>
							<h4>Tìm kiếm sản phẩm theo danh mục</h4>
							<p>Chọn nhanh nhóm sản phẩm bạn đang quan tâm</p>
						</div>
					</div>
					<button type='button' className={styles.close} onClick={() => setOpen(false)} aria-label='Đóng hộp thoại'>
						<IoClose size={22} color='#64748b' />
					</button>
				</div>

				<div className={styles.main}>
					{categorys?.map((c) => {
						const isActive = categoryId === c._id;

						return (
							<button
								key={c._id}
								type='button'
								aria-pressed={isActive}
								className={clsx(styles.filter_item, {[styles.active]: isActive})}
								onClick={() => handleSelectCategory(c._id)}
							>
								<CategoryIcon name={c.name} size={36} />
								<span className={styles.item_name}>{c.name}</span>
								<span className={styles.check_icon}>
									{isActive ? (
										<TickCircle size='20' color='#00b7c4' variant='Bold' />
									) : (
										<span className={styles.check_circle} />
									)}
								</span>
							</button>
						);
					})}
				</div>

				<div className={styles.footer}>
					<div className={styles.btn_wrap}>
						<Button p_10_24 white rounded_8 bold onClick={() => setOpen(false)}>
							Đóng
						</Button>
					</div>
					<div className={styles.btn_wrap}>
						<Button
							p_10_24
							bright-cyan
							rounded_8
							bold
							icon={<SearchNormal1 size='18' color='#fff' />}
							onClick={handleQuickFilterCategory}
						>
							{categoryId ? 'Tìm kiếm' : 'Xem tất cả sản phẩm'}
						</Button>
					</div>
				</div>
			</div>
		</Popup>
	);
}

export default QuickFilterCategory;
