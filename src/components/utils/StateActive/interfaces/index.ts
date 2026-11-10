export interface PropsStateActive {
	isBox?: boolean;
	stateActive: number | string | null;
	isSmall?: boolean;
	listState: {
		state: number | string;
		text: string;
		backgroundColor?: string;
		textColor?: string;
	}[];
}
