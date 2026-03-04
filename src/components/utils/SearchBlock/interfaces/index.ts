export interface PropsSearchBlock {
	placeholder?: string;
	keyword: string;
	setKeyword: (value: string) => void;
	action?: React.ReactNode;
}
