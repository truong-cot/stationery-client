export interface IDataUploadFile {
  url: string;
  file: File | null;
  path: string;
}

export interface PropsUploadSingleFile {
  label?: React.ReactNode | string;
  image: IDataUploadFile | null;
  setImage: React.Dispatch<React.SetStateAction<IDataUploadFile | null>>;
  isDisableDelete?: boolean;
  size?: "small" | "medium" | "large";
}
