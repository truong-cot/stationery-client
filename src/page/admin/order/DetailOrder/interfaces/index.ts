export interface PropsDetailOrder {
	_idOrder: string;
	onClose: () => void;
	onEdit?: () => void;
}

export interface IOrderItemDetail {
	product_id: string;
	product_name: string;
	product_image: string;
	pack_size: string;
	price: number;
	quantity: number;
	subtotal: number;
}

export interface IOrderDetail {
	_id: string;
	code: string;
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note?: string | null;
	items: IOrderItemDetail[];
	total_amount: number;
	order_status: string;
	created_at: string;
}
