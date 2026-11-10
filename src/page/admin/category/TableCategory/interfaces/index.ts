export interface PropsTableCategory {}

export interface ICategory {
	_id: string;
	name: string;
	description: string;
	image?: string | null;
	parent?: {
		_id: string;
		name: string;
	} | null;
}
