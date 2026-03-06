export interface PropsFilterProduct {}

export interface INodeCategory {
	_id: string;
	name: string;
	children: INodeCategory[];
}
