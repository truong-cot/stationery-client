import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';
import {PropsFilterDateRange} from './interfaces';
import styles from './FilterDateRange.module.scss';
import Moment from 'react-moment';
import {TYPE_DATE} from '~/constants/config/enum';
import {DATE_OPTIONS} from '~/constants/config';
import {IoIosArrowDown} from 'react-icons/io';
import DateOption from './components/DateOption';
import {getDateRange} from '~/funcs/selectData';

function FilterDateRange({name, hiddenOptionAll = false, date, setDate, typeDate, setTypeDate}: PropsFilterDateRange) {
	const [openDate, setOpenDate] = useState<boolean>(false);

	useEffect(() => {
		if (typeDate != TYPE_DATE.LUA_CHON) {
			setDate(getDateRange(typeDate));
		} else {
			if (!!date?.from && !!date.to) {
				setDate({
					from: date?.from,
					to: date.to,
				});
			}
		}
	}, [typeDate]);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={openDate}
			onClickOutside={() => setOpenDate(false)}
			placement='bottom-start'
			render={() => (
				<DateOption
					date={date}
					setDate={setDate}
					typeDate={typeDate}
					setTypeDate={setTypeDate}
					show={openDate}
					setShow={setOpenDate}
					hiddenOptionAll={hiddenOptionAll}
				/>
			)}
		>
			<div className={clsx(styles.container, {[styles.active]: openDate})} onClick={() => setOpenDate(!openDate)}>
				<div className={styles.value}>
					<p className={styles.name}>{name || 'Thời gian'}: </p>
					<p className={styles.text}>
						{typeDate == TYPE_DATE.LUA_CHON ? (
							<span>
								<Moment date={date?.from!} format='DD/MM/YYYY' /> - <Moment date={date?.to!} format='DD/MM/YYYY' />
							</span>
						) : (
							<span>{DATE_OPTIONS.find((v) => v.value == typeDate)?.name}</span>
						)}
					</p>
				</div>
				<div className={styles.icon_arrow}>
					<IoIosArrowDown size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default FilterDateRange;
