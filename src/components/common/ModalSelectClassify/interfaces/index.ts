export interface IClassifyItem {
	_id: string;
	name: string;
}

export interface IProductClassifySelect {
	_id: string;
	name: string;
	price: number;
	pack_size?: string;
	images?: string[];
	classifies?: IClassifyItem[];
}

export interface PropsModalSelectClassify {
	open: boolean;
	onClose: () => void;
	product: IProductClassifySelect;
	anchorImgEl?: HTMLImageElement | null;
}
