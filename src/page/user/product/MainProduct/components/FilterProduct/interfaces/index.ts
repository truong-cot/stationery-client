export interface PropsFilterProduct {
	onClose?: () => void;
}

export interface INodeCategory {
	_id: string;
	name: string;
	image?: string | null;
	children: INodeCategory[];
}
