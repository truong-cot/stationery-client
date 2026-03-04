"use client";

import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { PropsSelectMany } from "./interfaces";
import styles from "./SelectMany.module.scss";
import clsx from "clsx";
import { AddCircle } from "iconsax-react";
import Popup from "~/components/common/Popup";
import { GrSearch } from "react-icons/gr";
import Button from "~/components/common/Button";
import { IoClose } from "react-icons/io5";
import { removeVietnameseTones } from "~/funcs/optionConvert";
import Image from "next/image";
import icons from "~/constants/images/icons";

function SelectMany({
  label,
  placeholder,
  readOnly,
  title,
  description,
  checkeds,
  options,
  onSetDataCheckeds,
}: PropsSelectMany) {
  const refInputSearch = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [ids, setIds] = useState<string[]>([]);

  /* ---------------- sync props -> local state ---------------- */
  useEffect(() => {
    setIds(checkeds);
  }, [checkeds]);

  /* ---------------- filter options ---------------- */
  const filteredOptions = useMemo(() => {
    const key = removeVietnameseTones(keyword || "");
    return options.filter(
      (v) =>
        removeVietnameseTones(v.title)?.includes(key) ||
        removeVietnameseTones(v.code || "")?.includes(key),
    );
  }, [options, keyword]);

  /* ---------------- handlers ---------------- */
  const handleCheckItem = (_id: string) => {
    setIds((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id],
    );
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    if (checked) {
      setIds((prev) =>
        Array.from(new Set([...prev, ...filteredOptions.map((v) => v._id)])),
      );
    } else {
      setIds((prev) =>
        prev.filter((id) => !filteredOptions.some((v) => v._id === id)),
      );
    }
  };

  const handleSelectClick = () => {
    if (readOnly) return;

    setOpen(true);
    setTimeout(() => {
      refInputSearch.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    setKeyword("");
    setIds(checkeds); // reset local state
    setOpen(false);
  };

  const handleSubmit = () => {
    onSetDataCheckeds(ids);
    setOpen(false);
  };

  /* ---------------- derived state ---------------- */
  const isCheckAll =
    filteredOptions.length > 0 &&
    filteredOptions.every((v) => ids.includes(v._id));

  const isChanged =
    ids.length !== checkeds.length || !ids.every((id) => checkeds.includes(id));

  /* ---------------- render ---------------- */
  return (
    <Fragment>
      <div
        className={clsx(styles.container, {
          [styles.readOnly]: readOnly,
        })}
      >
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.main_select} onClick={handleSelectClick}>
          <p
            className={clsx(styles.value, {
              [styles.placeholder]: checkeds.length === 0,
            })}
          >
            {checkeds.length === 0
              ? placeholder
              : `Đã chọn ${checkeds.length} ${title.toLowerCase()}`}
          </p>

          {!readOnly && (
            <div className={styles.icon}>
              <AddCircle variant="Bold" size={18} color="#3772ff" />
            </div>
          )}
        </div>
      </div>

      <Popup open={open} onClose={handleClose} isFull>
        <div className={styles.main_popup} onClick={(e) => e.stopPropagation()}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.des}>{description}</p>

          {/* search */}
          <div className={styles.input}>
            <div className={styles.icon}>
              <GrSearch size={16} />
            </div>
            <input
              ref={refInputSearch}
              value={keyword}
              type="text"
              placeholder="Tìm kiếm ..."
              onChange={(e) => setKeyword(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* select all */}
          <div className={styles.select_all}>
            <div className={clsx(styles.option, styles.notBorder)}>
              <input
                id="check_all"
                type="checkbox"
                className={styles.checkbox}
                checked={isCheckAll}
                onChange={handleCheckAll}
              />
              <label htmlFor="check_all" className={styles.label_check_all}>
                Chọn tất cả
              </label>
            </div>

            <p className={styles.selected}>
              Đã chọn: <span>{ids.length}</span>
            </p>
          </div>

          {/* list */}
          <div className={styles.list}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div key={opt._id} className={styles.option}>
                  <input
                    id={`check_item_${idx}`}
                    type="checkbox"
                    className={styles.checkbox}
                    checked={ids.includes(opt._id)}
                    onChange={() => handleCheckItem(opt._id)}
                  />
                  <label
                    htmlFor={`check_item_${idx}`}
                    className={styles.label_check_item}
                  >
                    {opt.title}
                    {opt.code && <span> - {opt.code}</span>}
                  </label>
                </div>
              ))
            ) : (
              <div className={styles.empty}>
                <Image
                  alt="icon empty"
                  src={icons.emptySmall}
                  width={100}
                  height={100}
                />
                <p>Dữ liệu đang trống! thêm dữ liệu ngay . . .</p>
              </div>
            )}
          </div>

          {/* controls */}
          <div className={styles.control}>
            <div>
              <Button
                p_8_24
                rounded_8
                white
                bold
                maxHeight
                onClick={handleClose}
              >
                Hủy bỏ
              </Button>
            </div>

            <div>
              <Button
                disable={!isChanged}
                p_8_24
                rounded_8
                bright-cyan
                bold
                maxHeight
                onClick={handleSubmit}
              >
                Đồng ý
              </Button>
            </div>
          </div>

          <div className={styles.icon_close} onClick={handleClose}>
            <IoClose size={24} />
          </div>
        </div>
      </Popup>
    </Fragment>
  );
}

export default SelectMany;
