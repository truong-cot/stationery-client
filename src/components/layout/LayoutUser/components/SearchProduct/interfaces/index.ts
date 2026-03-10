export interface PropsSearchProduct {
	widthFull?: boolean;
	hiddenFilterCategory?: boolean;
}

export interface ISearchProduct {
	_id: string;
	name: string;
	price: number;
	code: string;
	images: string[];
}
