'use client';

import {useQuery} from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import {FilterSearch as IconSearch} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import {useMemo, useState} from 'react';
import FilterSearch from '~/components/common/FilterSearch';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import icons from '~/constants/images/icons';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {useDebounce} from '~/hooks/useDebounce';
import clientServices from '~/services/client.service';
import styles from './SearchProduct.module.scss';
import type {ISearchProduct, PropsSearchProduct} from './interfaces';
import clsx from 'clsx';
import {useRouter} from 'next/navigation';

function SearchProduct({}: PropsSearchProduct) {
	const router = useRouter();

	const [open, setOpen] = useState<boolean>(false);

	const [keyword, setKeyword] = useState<string>('');
	const [categoryId, setCategoryId] = useState<string>('');

	const debouncedKeyword = useDebounce(keyword, 500);

	const {data: categorys = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.clientCatalogCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.catalogCategory(),
			}),
	});

	const {data: products = [], isLoading} = useQuery<ISearchProduct[]>({
		queryKey: [QUERY_KEY.clientSearchProduct, debouncedKeyword, categoryId],
		queryFn: () =>
			httpRequest({
				http: clientServices.searchProduct({keyword: debouncedKeyword, category_id: categoryId}),
			}),
		enabled: open == true,
	});

	const renderUrlSearch = useMemo(() => {
		const params = new URLSearchParams();

		if (debouncedKeyword) params.set('_keyword', debouncedKeyword);
		if (categoryId) params.set('_categoryId', categoryId);

		const query = params.toString();

		return query ? `${PATH.Product}?${query}` : PATH.Product;
	}, [categoryId, debouncedKeyword]);

	const onKeyEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCategoryId('');
			setKeyword('');
			setOpen(false);
			router.push(renderUrlSearch);
		}
	};

	return (
		<div className={clsx(styles.search_product, {[styles.focus]: open})}>
			<div className={styles.filter_search}>
				<FilterSearch
					name='Danh mục'
					listOption={categorys?.map((v) => ({
						uuid: v?._id,
						name: v?.name,
					}))}
					value={categoryId}
					onSelect={(opt) => setCategoryId(opt.uuid)}
					onClean={() => setCategoryId('')}
				/>
			</div>
			<TippyHeadless
				maxWidth={'100%'}
				interactive
				visible={open}
				onClickOutside={() => setOpen(false)}
				placement='bottom'
				render={() => (
					<div className={styles.products}>
						{isLoading ? (
							<div className={styles.loading}>
								<div className={styles.ldsSpinner}>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
								<p>Vui lòng chờ, đang tải dữ liệu!</p>
							</div>
						) : (
							<>
								{products.length == 0 ? (
									<div className={styles.loading}>
										<Image alt='Ảnh dữ liệu trống' src={icons.emptySmall} width={80} height={80} />
										<p>Không tìm thấy sản phẩm phù hợp!</p>
									</div>
								) : (
									<>
										{products?.map((product) => (
											<div key={product._id} className={styles.product}>
												<Image
													alt='Ảnh sản phẩm'
													src={`${process.env.NEXT_PUBLIC_IMAGE}/${product?.images?.[0]}`}
													width={64}
													height={64}
													style={{borderRadius: '8px'}}
												/>
												<div className={styles.info}>
													<p>{product.code}</p>
													<Tippy key={product._id} content={product.name}>
														<Link
															href={`${PATH.Product}/${product._id}`}
															className={styles.name}
															onClick={() => setOpen(false)}
														>
															{product.name}
														</Link>
													</Tippy>
													<p>{convertCoin(product.price)}đ</p>
												</div>
											</div>
										))}
									</>
								)}
							</>
						)}
					</div>
				)}
			>
				<input
					className={styles.input}
					placeholder='Tìm kiếm sản phẩm'
					value={keyword}
					autoFocus={open}
					onChange={(e) => setKeyword(e.target.value)}
					onFocus={() => setOpen(true)}
					onKeyDown={onKeyEnterDown}
				/>
			</TippyHeadless>
			<Tippy content='Tìm kiếm'>
				<Link
					href={renderUrlSearch}
					className={styles.icon_search}
					onClick={() => {
						setCategoryId('');
						setKeyword('');
					}}
				>
					<IconSearch size={24} color='#00B7C4' variant='Bold' />
				</Link>
			</Tippy>
		</div>
	);
}

export default SearchProduct;
