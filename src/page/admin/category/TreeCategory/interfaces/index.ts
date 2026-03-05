export interface PropsTreeCategory {}

export interface INodeCategory {
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
	children: INodeCategory[];
}
