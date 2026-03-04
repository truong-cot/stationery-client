import {Dispatch, SetStateAction} from 'react';

export interface PropsFilterCustom<T extends number | string | null> {
	name: string;
	listOption: {
		uuid: number | string;
		name: string;
		code?: string;
	}[];
	value: T;
	setValue: Dispatch<SetStateAction<T>>;
}
