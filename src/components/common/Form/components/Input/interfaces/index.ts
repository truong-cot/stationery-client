export interface PropsInput {
	type: string;
	name: string;
	placeholder: string;

	icon?: React.ReactNode;
	label?: string | React.ReactNode;
	action?: React.ReactNode;

	value?: string | number;
	unit?: string | React.ReactNode;
	note?: string;
	textRequired?: string;
	valueConfirm?: string;
	textConfirm?: string;

	isBlur?: boolean;
	onClean?: boolean;
	showDone?: boolean;
	showError?: boolean;
	readOnly?: boolean;

	max?: number;
	min?: number;

	isRequired?: boolean;
	isNumber?: boolean;
	isPhone?: boolean;
	isEmail?: boolean;
	isMoney?: boolean;
	isUppercase?: boolean;
	isShowValue?: boolean;

	onBlur?: () => void;
	onChangeValue?: (val: string | number) => void;
}
