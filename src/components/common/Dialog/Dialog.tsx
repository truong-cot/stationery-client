'use client';

import React from 'react';

import {PropsDialog} from './interfaces';
import styles from './Dialog.module.scss';
import Popup from '../Popup';
import Button from '../Button';
import {IoClose} from 'react-icons/io5';
import {Warning2} from 'iconsax-react';

function Dialog({
	open,
	title,
	note,
	icon = <Warning2 size='28' color='#EE0033' />,
	borderIconColor = '#fff0f3',
	backgroundIconColor = '#ffdce4',
	titleCancel = 'Hủy bỏ',
	titleSubmit = 'Xác nhận',
	onClose,
	onSubmit,
	type = 'primary',
	form,
	isDisabledBtnSubmit,
}: PropsDialog) {
	return (
		<Popup open={open} onClose={onClose}>
			<div className={styles.container}>
				<div
					style={{
						background: backgroundIconColor,
						border: `8px solid ${borderIconColor}`,
					}}
					className={styles.main_icon}
				>
					{icon}
				</div>
				<h4 className={styles.title}>{title}</h4>
				<p className={styles.note}>{note}</p>
				{form && <div className={styles.form}>{form}</div>}
				<div className={styles.groupBtn}>
					<Button white rounded_20 bold p_8_24 onClick={onClose}>
						{titleCancel}
					</Button>
					<Button
						bold
						rounded_20
						p_8_24
						green={type == 'primary'}
						red={type == 'error'}
						orange={type == 'warning'}
						onClick={onSubmit}
						disable={isDisabledBtnSubmit}
					>
						{titleSubmit}
					</Button>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose size={24} color='#8492A6' />
				</div>
			</div>
		</Popup>
	);
}

export default Dialog;
