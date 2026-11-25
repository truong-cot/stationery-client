export interface PropsSwitch {
	checked?: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'small' | 'medium';
}
