import React, {useMemo} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import {PropsDateOption} from './interfaces';

import styles from './DateOption.module.scss';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {TYPE_DATE} from '~/constants/config/enum';
import {DATE_OPTIONS} from '~/constants/config';
import RangeDatePicker from '../RangeDatePicker';
import {getDateRange} from '~/funcs/selectData';

function DateOption({hiddenOptionAll = false, date, setDate, typeDate, setTypeDate, show, setShow}: PropsDateOption) {
	const options = useMemo(() => {
		if (!hiddenOptionAll) {
			return DATE_OPTIONS;
		} else {
			return DATE_OPTIONS.filter((v) => v?.value != TYPE_DATE.ALL);
		}
	}, [hiddenOptionAll]);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={Number(typeDate) == TYPE_DATE.LUA_CHON}
			placement='right-start'
			render={(attrs) => (
				<div className={styles.main_calender}>
					<RangeDatePicker
						value={date}
						onSetValue={setDate}
						onClose={() => setShow(false)}
						open={show && Number(typeDate) == TYPE_DATE.LUA_CHON}
					/>
				</div>
			)}
		>
			<div className={styles.mainOption}>
				{options.map((v, i) => (
					<div
						key={i}
						className={clsx(styles.option, {
							[styles.option_active]: Number(typeDate) == v.value,
						})}
						onClick={() => {
							if (v.value != TYPE_DATE.LUA_CHON) {
								setDate(getDateRange(v.value));
								setShow(false);
							}
							setTypeDate(v.value);
						}}
					>
						<p>{v.name}</p>
						{Number(typeDate) == v.value && (
							<div className={styles.icon_check}>
								<BiCheck fontSize={18} color='#149343' fontWeight={600} />
							</div>
						)}
					</div>
				))}
			</div>
		</TippyHeadless>
	);
}

export default DateOption;
