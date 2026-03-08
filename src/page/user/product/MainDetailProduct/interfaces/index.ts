export interface PropsMainDetailProduct {
	product: IProductDetail;
}

export interface IProductDetail {
	_id: string;
	name: string;
	price: number;
	code: string;
	images: string[];
	short_description: string;
	detail_description: string;
	specifications: {name: string; description: string}[];
	category: {
		_id: string;
		name: string;
	};
	color: {
		_id: string;
		name: string;
	};
	size: {
		_id: string;
		name: string;
	};
	trademark: {
		_id: string;
		name: string;
	};
	tree_category: {_id: string; name: string}[];
}
