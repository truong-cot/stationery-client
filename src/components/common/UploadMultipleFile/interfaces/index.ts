import { IDataUploadFile } from "../../UploadSingleFile/interfaces";

export interface PropsUploadMultipleFile {
  label?: React.ReactNode | string;
  images: IDataUploadFile[];
  setImages: React.Dispatch<React.SetStateAction<IDataUploadFile[]>>;
  readOnly?: boolean;
  isDisableDelete?: boolean;
  size?: "small" | "medium" | "large";
}
