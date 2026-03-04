export interface PropsTextArea {
	name: string;
	value?: string;
	placeholder: string;

	label?: string | React.ReactNode;

	isBlur?: boolean;
	showDone?: boolean;
	readOnly?: boolean;
	textRequired?: string;

	max?: number;
	min?: number;

	isRequired?: boolean;
}
