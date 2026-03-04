export interface PropsDialog {
	open: boolean;
	title: string;
	note?: string | React.ReactNode;
	icon?: React.ReactNode;
	borderIconColor?: string;
	backgroundIconColor?: string;
	titleCancel?: string;
	titleSubmit?: string;
	type?: 'primary' | 'error' | 'warning';
	onClose: () => void;
	onSubmit: () => void;
	form?: React.ReactNode;
	isDisabledBtnSubmit?: boolean;
}
