import React, {useEffect, useRef, useState} from 'react';

import {PropsSearchBlock} from './interfaces';
import styles from './SearchBlock.module.scss';
import {SearchNormal} from 'iconsax-react';

function SearchBlock({keyword, setKeyword, placeholder = 'Nhập từ khóa tìm kiếm', action}: PropsSearchBlock) {
	const inputSearchRef = useRef<HTMLInputElement>(null);

	const [searchTerm, setSearchTerm] = useState(keyword);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			setKeyword(searchTerm);
		}, 600);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm, setKeyword]);

	useEffect(() => {
		if (inputSearchRef.current) {
			inputSearchRef.current.focus();
		}
	}, []);

	const handleSelectClick = () => {
		if (inputSearchRef.current) {
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 0);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.inputSearch} onClick={handleSelectClick}>
				<div className={styles.icon}>
					<SearchNormal color='#149343' size={20} />
				</div>
				<input ref={inputSearchRef} placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			</div>
			{action && (
				<>
					<div className={styles.line}></div>
					{action}
				</>
			)}
		</div>
	);
}

export default SearchBlock;
