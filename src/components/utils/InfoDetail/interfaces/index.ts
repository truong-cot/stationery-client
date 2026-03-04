export interface PropsInfoDetail {
	name: string;
	value: string | number | React.ReactNode;
	textColor?: string;
	images?: string[];
	actions?: React.ReactNode;
	isMarginTop?: boolean;
	widthImage?: number;
	heightImage?: number;
}
