'use client';

import {useQuery} from '@tanstack/react-query';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
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

	return (
		<Popup open={open} onClose={() => setOpen(false)} isFull={true}>
			<div className={styles.quick_filter_category}>
				<h4>Tìm kiếm sản phẩm theo danh mục</h4>
				<div className={styles.line}></div>

				<div className={styles.main}>
					{categorys?.map((c) => (
						<div key={c._id} className={styles.filter_item} onClick={() => setCategoryId(c?._id)}>
							<input id={`size-${c._id}`} type='checkbox' name='size' checked={categoryId == c._id} />
							<label htmlFor={`size-${c._id}`}>{c.name}</label>
						</div>
					))}
				</div>

				<div className={styles.list_btn}>
					<div>
						<Button p_10_24 white rounded_8 bold onClick={() => setOpen(false)}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 green rounded_8 bold onClick={handleQuickFilterCategory}>
							Tìm kiếm
						</Button>
					</div>
				</div>

				<div className={styles.close} onClick={() => setOpen(false)}>
					<IoClose size={28} color='#8492A6' />
				</div>
			</div>
		</Popup>
	);
}

export default QuickFilterCategory;
