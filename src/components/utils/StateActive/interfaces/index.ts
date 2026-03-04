export interface PropsStateActive {
	isBox?: boolean;
	stateActive: number | null;
	isSmall?: boolean;
	listState: {
		state: number;
		text: string;
		backgroundColor?: string;
		textColor?: string;
	}[];
}
