export interface PropsMainTrademark {}

export interface ITrademark {
	_id: string;
	name: string;
	description: string;
	categories: {
		_id: string;
		name: string;
	}[];
}
