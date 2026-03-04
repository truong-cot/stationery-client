export interface PropsFormUpdateColor {
	_idColor: string;
	onClose: () => void;
}

export interface IDetailColor {
	_id: string;
	code: string;
	name: string;
	description: string;
	categories: {
		_id: string;
		name: string;
	}[];
}
