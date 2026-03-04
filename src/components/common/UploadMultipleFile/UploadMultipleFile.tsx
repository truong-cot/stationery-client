import React, { Fragment, ChangeEvent } from "react";
import { PropsUploadMultipleFile } from "./interfaces";
import styles from "./UploadMultipleFile.module.scss";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import clsx from "clsx";
import icons from "~/constants/images/icons";
import { IDataUploadFile } from "../UploadSingleFile/interfaces";

function UploadMultipleFile({
  label,
  images = [],
  setImages,
  readOnly = false,
  isDisableDelete = false,
  size = "small",
}: PropsUploadMultipleFile) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: IDataUploadFile[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
      path: "",
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDelete = (index: number) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages[index];
      if (imageToRemove?.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return [...prevImages.slice(0, index), ...prevImages.slice(index + 1)];
    });
  };

  return (
    <Fragment>
      {label && (
        <label htmlFor="input-upload-file" className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.main_upload}>
        {!readOnly && (
          <div className={styles.upload}>
            <label className={clsx(styles.input_upload, styles[size])}>
              <Image alt="Icon upload file" src={icons.iconUploadFile} />
              <input
                id="input-upload-file"
                hidden
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = "";
                }}
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {images.length > 0 && (
          <div className={styles.list_image}>
            {images.map((image, index) => (
              <div className={clsx(styles.box_image, styles[size])} key={index}>
                <Image
                  className={styles.image}
                  src={image.url || image.path}
                  alt="uploaded image"
                  style={{ objectFit: "cover" }}
                  layout="fill"
                />
                {!isDisableDelete && (
                  <div
                    className={clsx(styles.delete)}
                    onClick={() => handleDelete(index)}
                  >
                    <IoClose size={14} color="#202939" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default UploadMultipleFile;
