import {createContext} from 'react';

export interface ICatalog {
	_id: string;
	name: string;
	code?: string;
}

export interface IContextProduct {
	categorys: ICatalog[];
	sizes: ICatalog[];
}

export const ContextProduct = createContext<IContextProduct>({
	categorys: [],
	sizes: [],
});
