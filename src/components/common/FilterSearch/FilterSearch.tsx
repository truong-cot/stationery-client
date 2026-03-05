import {useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import styles from './FilterSearch.module.scss';
import type {PropsFilterSearch} from './interfaces';
import {IoIosArrowDown} from 'react-icons/io';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {removeVietnameseTones} from '~/funcs/optionConvert';

function FilterSearch({name, value, listOption, onSelect, onClean}: PropsFilterSearch) {
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
			placement='bottom'
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
								[styles.option_active]: value == '',
							})}
							onClick={() => {
								setOpen(false);
								onClean();
							}}
						>
							<p>Tất cả</p>
							{value == '' && (
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
										[styles.option_active]: value == v.uuid,
									})}
									onClick={() => {
										setOpen(false);
										onSelect(v);
									}}
								>
									<p>{v?.name}</p>
									{value == v.uuid && (
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
				className={clsx(styles.actionPayment_type, {[styles.active]: open})}
				onClick={() => {
					setOpen(!open);
					handleSelectClick();
				}}
			>
				<p className={clsx(styles.value, {[styles.placeholder]: !listOption.find((v) => v.uuid)})}>
					{listOption.find((v) => v.uuid == value)?.name || name}
				</p>
				<div className={styles.icon_arrow}>
					<IoIosArrowDown size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default FilterSearch;
