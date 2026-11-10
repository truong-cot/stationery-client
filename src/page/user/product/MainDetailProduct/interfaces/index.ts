export interface PropsMainDetailProduct {
	product: IProductDetail;
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
	color?: {
		_id: string;
		name: string;
	};
	colors?: {
		_id: string;
		name: string;
	}[];
	size?: {
		_id: string;
		name: string;
	};
	trademark?: {
		_id: string;
		name: string;
	};
	tree_category: {_id: string; name: string}[];
}
