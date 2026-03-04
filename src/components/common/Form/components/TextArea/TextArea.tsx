import React, {useContext, useEffect, useState} from 'react';

import {PropsTextArea} from './interfaces';
import styles from './TextArea.module.scss';
import {ContextForm, IContextForm} from '../../contexts';
import clsx from 'clsx';

function TextArea({name, value, placeholder, label, isBlur = true, showDone, readOnly, max, min, isRequired, textRequired}: PropsTextArea) {
	const [isFocus, setIsFocus] = useState<boolean>(false);

	const {form, countValidate, errorText, isDone, setForm, setValidate, setErrorText, setCountValidate} =
		useContext<IContextForm<any>>(ContextForm);

	/********** Xử lí khi submit, kiểm tra validate input **********/
	useEffect(() => {
		if (countValidate > 0) handleSetMessage();
	}, [countValidate]);

	/********** Xử lí khi value input thay đổi, kiểm tra validate input **********/
	useEffect(() => {
		setValidate((prev) => ({
			...prev,
			[name]: handleValidate(),
		}));
	}, [form[name]]);

	const handlerFocused = () => {
		setIsFocus(true);
		setErrorText((prev) => ({...prev, [name]: null}));
	};

	const handlerBlur = () => {
		setIsFocus(false);

		if (isBlur) {
			handleSetMessage();
			setValidate((prev) => ({
				...prev,
				[name]: handleValidate(),
			}));
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;

		setForm((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSetMessage = () => {
		setErrorText((prev) => ({...prev, [name]: null}));

		if (isRequired && `${form[name]}`.trim() === '') {
			setErrorText((prev) => ({
				...prev,
				[name]: textRequired || 'Vui lòng nhập trường này',
			}));
			return;
		}

		if (max && `${form[name]}`.trim().length > max) {
			return setErrorText((prev: any) => ({
				...prev,
				[name]: `Nhập tối đa ${max} kí tự`,
			}));
		}

		if (min && `${form[name]}`.trim().length < min) {
			return setErrorText((prev: any) => ({
				...prev,
				[name]: `Nhập tối thiểu ${min} kí tự`,
			}));
		}
	};

	const handleValidate = (): boolean => {
		if (isRequired && `${form[name]}`.trim() === '') {
			return false;
		}
		if (min && `${form[name]}`.trim().length < min) {
			return false;
		}

		return true;
	};

	return (
		<div
			className={clsx(styles.container, {
				[styles.focus]: isFocus,
				[styles.error]: errorText[name] !== null,
				[styles.readOnly]: readOnly,
				[styles.done]: showDone && isDone,
			})}
		>
			{label ? (
				<label htmlFor={`textarea_${name}`} className={styles.label}>
					{label}
				</label>
			) : null}
			<textarea
				id={`textarea_${name}`}
				className={styles.textarea}
				name={name}
				value={value ? value : `${form[name]}`}
				placeholder={placeholder}
				autoComplete='off'
				readOnly={readOnly}
				disabled={readOnly}
				onChange={handleChange}
				onFocus={handlerFocused}
				onBlur={handlerBlur}
			/>
			{errorText[name] && <p className={styles.errorText}>{errorText[name]}</p>}
		</div>
	);
}

export default TextArea;
