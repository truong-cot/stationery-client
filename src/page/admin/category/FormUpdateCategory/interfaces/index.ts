export interface PropsFormUpdateCategory {
	_idCategory: string;
	onClose: () => void;
}

export interface IDetailCategory {
	_id: string;
	name: string;
	description: string;
	image?: string | null;
	parent?: {
		_id: string;
		name: string;
	} | null;
}
