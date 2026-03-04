import React, {useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsFilterCustom} from './interfaces';
import styles from './FilterCustom.module.scss';
import clsx from 'clsx';
import {IoIosArrowDown} from 'react-icons/io';
import {BiCheck} from 'react-icons/bi';
import {removeVietnameseTones} from '~/funcs/optionConvert';

function FilterCustom<T extends string | number | null>({name, listOption, value, setValue}: PropsFilterCustom<T>) {
	const inputSearchRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState<boolean>(false);
	const [keyword, setKeyword] = useState<string>('');

	const handleSelectClick = () => {
		if (inputSearchRef?.current) {
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 0);
		}
	};

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={open}
			onClickOutside={() => setOpen(false)}
			placement='bottom-start'
			render={(attrs: any) => (
				<div className={styles.mainOption}>
					<input
						ref={inputSearchRef}
						placeholder='Tìm kiếm...'
						className={styles.inputSearch}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
					<div className={styles.list_option}>
						<div
							className={clsx(styles.option, {
								[styles.option_active]: value === null || value === '',
							})}
							onClick={() => {
								if (value === null || value === '') {
									setOpen(false);
								} else {
									setOpen(false);
									setValue((typeof value === 'number' ? null : '') as T);
								}
							}}
						>
							<p>Tất cả</p>
							{(value === null || value === '') && (
								<div className={styles.icon_check}>
									<BiCheck fontSize={18} color='#149343' fontWeight={600} />
								</div>
							)}
						</div>
						{listOption
							?.filter((k) => removeVietnameseTones(k.name)?.includes(keyword ? removeVietnameseTones(keyword) : ''))
							?.map((v) => (
								<div
									key={v?.uuid}
									className={clsx(styles.option, {
										[styles.option_active]: value == v?.uuid,
									})}
									onClick={() => {
										setOpen(false);
										setValue(v?.uuid as T);
									}}
								>
									<p>{v?.name}</p>
									{value == v?.uuid && (
										<div className={styles.icon_check}>
											<BiCheck fontSize={18} color='#149343' fontWeight={600} />
										</div>
									)}
								</div>
							))}
					</div>
				</div>
			)}
		>
			<div
				className={clsx(styles.container, {[styles.active]: open})}
				onClick={() => {
					setOpen(!open);
					handleSelectClick();
				}}
			>
				<div className={styles.value}>
					<p className={styles.name}>{name}:</p>
					<p className={styles.text}>{listOption?.find((v) => v?.uuid == value)?.name || 'Tất cả'}</p>
				</div>
				<div className={styles.icon_arrow}>
					<IoIosArrowDown size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default FilterCustom;
