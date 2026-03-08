export interface PropsFilterProduct {
	onClose?: () => void;
}

export interface INodeCategory {
	_id: string;
	name: string;
	children: INodeCategory[];
}
