export interface PropsFormUpdateSize {
	_idSize: string;
	onClose: () => void;
}

export interface IDetailSize {
	_id: string;
	name: string;
	description: string;
	categories: {
		_id: string;
		name: string;
	}[];
}
