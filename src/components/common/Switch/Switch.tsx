'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.scss';
import {PropsSwitch} from './interfaces';

const Switch: React.FC<PropsSwitch> = ({
	checked = false,
	disabled = false,
	onChange,
	size = 'medium',
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		onChange?.(e.target.checked);
	};

	return (
		<label
			className={clsx(styles.switch, {
				[styles.disabled]: disabled,
				[styles.small]: size === 'small',
			})}
		>
			<input
				type='checkbox'
				role='switch'
				aria-checked={checked}
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
			/>
			<span className={styles.slider} />
		</label>
	);
};

export default Switch;
