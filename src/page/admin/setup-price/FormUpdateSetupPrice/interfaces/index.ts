export interface PropsFormUpdateSetupPrice {
	_idSetupPrice: string;
	onClose: () => void;
}

export interface IDetailSetupPrice {
	_id: string;
	min: number;
	max: number;
	description: string;
}
