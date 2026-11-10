export interface PropsFormCreateOrder {
	onClose: () => void;
}

export interface ISelectedProductItem {
	product_id: string;
	name: string;
	pack_size: string;
	price: number;
	image: string;
	quantity: number;
}

