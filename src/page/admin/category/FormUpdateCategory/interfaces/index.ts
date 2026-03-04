export interface PropsFormUpdateCategory {
	_idCategory: string;
	onClose: () => void;
}

export interface IDetailCategory {
	_id: string;
	name: string;
	description: string;
	parent: {
		_id: string;
		name: string;
	};
	colors: {
		_id: string;
		name: string;
	}[];
	sizes: {
		_id: string;
		name: string;
	}[];
	trademarks: {
		_id: string;
		name: string;
	}[];
}
