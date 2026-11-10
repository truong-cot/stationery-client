export interface PropsTreeCategory {}

export interface INodeCategory {
	_id: string;
	name: string;
	description: string;
	image?: string | null;
	parent?: {
		_id: string;
		name: string;
	} | null;
	children: INodeCategory[];
}
