export interface PropsMainCategory {}

export interface ICategory {
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
