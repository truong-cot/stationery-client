export interface PropsSelectMany {
  placeholder: string;
  label?: string | React.ReactNode;
  readOnly?: boolean;
  title: string;
  description: string;

  checkeds: string[];
  onSetDataCheckeds: (arr: string[]) => void;
  options: { _id: string; title: string; code?: string }[];
}
