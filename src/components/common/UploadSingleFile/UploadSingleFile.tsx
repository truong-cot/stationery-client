import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { IoClose } from "react-icons/io5";
import icons from "~/constants/images/icons";
import styles from "./UploadSingleFile.module.scss";
import { IDataUploadFile, PropsUploadSingleFile } from "./interfaces";

function UploadSingleFile({
  label,
  image,
  setImage,
  isDisableDelete = false,
  size = "small",
}: PropsUploadSingleFile) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const newImage: IDataUploadFile = {
      url: URL.createObjectURL(file),
      file,
      path: "",
    };
    setImage(newImage);
  };

  const handleDelete = () => {
    if (image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
  };

  const handleReplaceImage = () => {
    fileInputRef.current?.click();
  };

  const imageSrc =
    image?.url ||
    (image?.path
      ? image.path.startsWith("http") || image.path.startsWith("/")
        ? image.path
        : `${process.env.NEXT_PUBLIC_IMAGE}/${image.path}`
      : "");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor="input-upload-file" className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.upload}>
        {image && imageSrc ? (
          <div
            className={clsx(styles.box_image, styles[size])}
            onClick={handleReplaceImage}
            style={{ cursor: "pointer" }}
          >
            <Image
              unoptimized
              src={imageSrc}
              alt="uploaded"
              layout="fill"
              style={{ objectFit: "cover" }}
              className={styles.image}
            />
            {!isDisableDelete && (
              <div
                className={styles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <IoClose size={14} color="#202939" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg"
              onClick={(e) => ((e.target as HTMLInputElement).value = "")}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <label className={clsx(styles.input_upload, styles[size])}>
            <Image alt="Upload file icon" src={icons.iconUploadFile} />
            <input
              ref={fileInputRef}
              id="input-upload-file"
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg"
              onClick={(e) => ((e.target as HTMLInputElement).value = "")}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}

export default UploadSingleFile;
