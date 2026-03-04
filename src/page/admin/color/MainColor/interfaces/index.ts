export interface PropsMainColor {}

export interface IColor {
	_id: string;
	name: string;
	code: string;
	description: string;
	categories: {
		_id: string;
		name: string;
	}[];
}
