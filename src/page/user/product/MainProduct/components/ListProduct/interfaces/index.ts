export interface PropsListProduct {}

export interface IProductClient {
	_id: string;
	name: string;
	price: number;
	pack_size: string;
	images: string[];
	short_description: string;
	is_featured: boolean;
}
