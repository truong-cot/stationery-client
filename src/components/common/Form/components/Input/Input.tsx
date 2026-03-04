import React, { useContext, useEffect, useState } from "react";

import { PropsInput } from "./interfaces";
import styles from "./Input.module.scss";
import { ContextForm, IContextForm } from "../../contexts";
import clsx from "clsx";
import {
  RiCheckFill,
  RiCloseCircleFill,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { validateEmail, validatePhoneNumber } from "~/funcs/validate";
import { convertCoin, price } from "~/funcs/convertCoin";

function Input({
  type,
  name,
  placeholder,
  icon,
  label,
  action,
  value,
  unit,
  note,
  textRequired,
  textConfirm,
  valueConfirm,
  isBlur = true,
  onClean,
  showDone,
  showError = true,
  readOnly,
  max,
  min,
  isRequired,
  isNumber,
  isUppercase,
  isPhone,
  isEmail,
  isMoney,
  isShowValue = false,
  onBlur,
  onChangeValue,
}: PropsInput) {
  const isPassword = type === "password";

  const [showPass, setShowPass] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const {
    form,
    countValidate,
    errorText,
    isDone,
    setForm,
    setValidate,
    setErrorText,
    setCountValidate,
  } = useContext<IContextForm<any>>(ContextForm);

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

  /********** Kiểm tra thay đổi value confirm **********/
  useEffect(() => {
    if (valueConfirm && form[name] !== valueConfirm && form[name] !== "") {
      setErrorText((prev) => ({
        ...prev,
        [name]: textConfirm || "Mật khẩu không trùng khớp",
      }));
    } else {
      setErrorText((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [valueConfirm]);

  const handlerFocused = () => {
    setIsFocus(true);
    setErrorText((prev) => ({ ...prev, [name]: null }));
  };

  const handlerBlur = () => {
    setIsFocus(false);

    if (onBlur) {
      onBlur();
    } else {
      if (isBlur) {
        handleSetMessage();
        setValidate((prev) => ({
          ...prev,
          [name]: handleValidate(),
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (onChangeValue) {
      onChangeValue(value);
    } else {
      if (isMoney) {
        const numeric = Number(price(value));
        setForm((prev: any) => ({
          ...prev,
          [name]: numeric ? convertCoin(numeric) : "0",
        }));
        return;
      }

      const newValue = isUppercase ? value.toUpperCase() : value;

      setForm((prev: any) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSetMessage = () => {
    setErrorText((prev) => ({ ...prev, [name]: null }));

    if (isRequired && `${form[name]}`.trim() === "") {
      setErrorText((prev) => ({
        ...prev,
        [name]: textRequired || "Vui lòng nhập trường này",
      }));
      return;
    }

    if (!!form[name]) {
      if (isNumber && !Number(form[name])) {
        setErrorText((prev) => ({
          ...prev,
          [name]: "Vui lòng chỉ nhập số",
        }));
        return;
      }

      if (isPhone && !validatePhoneNumber(form[name])) {
        setErrorText((prev) => ({
          ...prev,
          [name]: "Định dạng số điện thoại không đúng",
        }));
        return;
      }

      if (isEmail && !validateEmail(form[name])) {
        setErrorText((prev) => ({
          ...prev,
          [name]: "Định dạng email không chính xác",
        }));
        return;
      }

      if (valueConfirm && form[name] !== valueConfirm) {
        setErrorText((prev) => ({
          ...prev,
          [name]: textConfirm || "Mật khẩu không trùng khớp",
        }));
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
    }
  };

  const handleValidate = (): boolean => {
    if (isRequired && `${form[name]}`.trim() === "") {
      return false;
    }

    if (!!form[name]) {
      if (isNumber && !Number(form[name])) {
        return false;
      }
      if (isPhone && !validatePhoneNumber(form[name])) {
        return false;
      }
      if (isEmail && !validateEmail(form[name])) {
        return false;
      }
      if (valueConfirm && form[name] !== valueConfirm) {
        return false;
      }
      if (max && `${form[name]}`.trim().length > max) {
        return false;
      }
      if (min && `${form[name]}`.trim().length < min) {
        return false;
      }
    }

    return true;
  };

  const handleClean = () => {
    setForm((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleToggleShowPass = () => {
    setShowPass(!showPass);
  };

  return (
    <div
      className={clsx(styles.container, {
        [styles.focus]: isFocus,
        [styles.error]: showError && errorText[name] !== null,
        [styles.readOnly]: readOnly,
        [styles.done]: showDone && isDone,
      })}
    >
      {label ? (
        <label htmlFor={`input_${name}`} className={styles.label}>
          {label}
        </label>
      ) : null}
      <div className={styles.main_input}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
          id={`input_${name}`}
          className={styles.input}
          name={name}
          // value={value != undefined || value !== null ? value : `${form[name]}`}
          value={isShowValue ? value : `${form[name]}`}
          type={showPass ? "text" : type}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly}
          disabled={readOnly}
          onFocus={handlerFocused}
          onChange={handleChange}
          onBlur={handlerBlur}
        />
        {unit ? (
          <div className={styles.unit}>{unit}</div>
        ) : (
          <div className={styles.control}>
            {onClean && !!form[name] ? (
              <div className={styles.icon_control} onClick={handleClean}>
                <RiCloseCircleFill size={18} color="#29303c" />
              </div>
            ) : null}
            {!isPassword && onClean && !!form[name] ? (
              <div className={styles.icon_control}>
                <RiCheckFill size={20} color="#2cae39" />
              </div>
            ) : null}
            {isPassword ? (
              <div
                className={styles.icon_control}
                onClick={handleToggleShowPass}
              >
                {showPass ? (
                  <RiEyeLine size={20} color="#29303c" />
                ) : (
                  <RiEyeOffLine size={20} color="#29303c" />
                )}
              </div>
            ) : null}
            {action ? (
              <div
                onClick={(e) => e.preventDefault()}
                className={styles.icon_control}
              >
                {action}
              </div>
            ) : null}
          </div>
        )}
      </div>
      {showError && errorText[name] && (
        <p className={styles.errorText}>{errorText[name]}</p>
      )}
      {note ? <small className={styles.note}>{note}</small> : null}
    </div>
  );
}

export default Input;
