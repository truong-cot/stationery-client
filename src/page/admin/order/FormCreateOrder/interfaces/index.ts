export interface PropsFormCreateOrder {
	onClose: () => void;
}

export interface ISelectedProductItem {
	cartItemId: string;
	product_id: string;
	classify_id?: string | null;
	classify_name?: string | null;
	name: string;
	pack_size: string;
	price: number;
	image: string;
	quantity: number;
}
