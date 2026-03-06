import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import styles from './SearchQuery.module.scss';
import type {PropsSearchQuery} from './interfaces';
import {FilterSearch as IconSearch} from 'iconsax-react';
import {useEffect, useState} from 'react';
import clsx from 'clsx';

function SearchQuery({placeholder = 'Tìm kiếm', keyName = '_keyword'}: PropsSearchQuery) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [keyword, setKeyword] = useState<string>('');
	const [isFocus, setIsFocus] = useState<boolean>(false);

	const keyQuery = searchParams.get(keyName);

	// sync URL -> state
	useEffect(() => {
		if (keyQuery) setKeyword(keyQuery);
	}, [keyQuery]);

	// debounce update URL
	useEffect(() => {
		const handler = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());

			if (keyword) {
				params.set(keyName, keyword);
			} else {
				params.delete(keyName);
			}

			router.replace(`${pathname}?${params.toString()}`, {scroll: false});
		}, 500);

		return () => clearTimeout(handler);
	}, [keyword, keyName, pathname, router, searchParams]);

	return (
		<div className={clsx(styles.search_query, {[styles.focus]: isFocus})}>
			<input
				className={styles.input}
				placeholder={placeholder}
				value={keyword}
				onFocus={() => setIsFocus(true)}
				onBlur={() => setIsFocus(false)}
				onChange={(e) => setKeyword(e.target.value)}
			/>
			<div className={styles.icon_search}>
				<IconSearch size={24} color='#00B7C4' variant='Bold' />
			</div>
		</div>
	);
}

export default SearchQuery;
