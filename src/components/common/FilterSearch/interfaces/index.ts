interface IOption {
	uuid: string;
	name: string;
	code?: string;
}

export interface PropsFilterSearch {
	name: string;
	value: string;
	listOption: IOption[];
	onSelect: (option: IOption) => void;
	onClean: () => void;
}
