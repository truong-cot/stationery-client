export interface PropsMainDetailProduct {
	_idProduct?: string;
	onClose?: () => void;
	onEdit?: () => void;
}

export interface IDetailProduct {
	_id: string;
	name: string;
	price: number;
	pack_size: string;
	images: string[];
	short_description?: string;
	category?: {
		_id: string;
		name: string;
	};
	classifies?: {
		_id: string;
		name: string;
	}[];
	colors?: {
		_id: string;
		name: string;
	}[];
	size?: {
		_id: string;
		name: string;
	} | null;
	trademark?: {
		_id: string;
		name: string;
	} | null;
	is_featured: boolean;
	status?: number;
}
