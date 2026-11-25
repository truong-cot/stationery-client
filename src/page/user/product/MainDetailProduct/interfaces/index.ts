export interface PropsMainDetailProduct {
	product: IProductDetail | null;
}

export interface IProductDetail {
	_id: string;
	name: string;
	price: number;
	pack_size: string;
	images: string[];
	short_description: string;
	category: {
		_id: string;
		name: string;
	};
	classifies?: {
		_id: string;
		name: string;
	}[];
	size?: {
		_id: string;
		name: string;
	};
	status?: number;
	tree_category: {_id: string; name: string}[];
}
