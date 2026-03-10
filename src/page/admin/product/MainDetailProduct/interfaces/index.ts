export interface PropsMainDetailProduct {}

export interface IDetailProduct {
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
}
