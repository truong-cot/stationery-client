export interface PropsMainProduct {}

export interface IProduct {
	_id: string;
	name: string;
	price: number;
	code: string;
	images: string[];
	short_description: string;
	detail_description: string;
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
	is_featured: boolean;
	specifications: {
		name: string;
		description: string;
	}[];
}
