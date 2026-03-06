import {createContext} from 'react';

export interface ICatalog {
	_id: string;
	name: string;
	code?: string;
}

export interface ICatalogSetupPrice {
	_id: string;
	min: number;
	max: number;
}

export interface IContextProduct {
	categorys: ICatalog[];
	colors: ICatalog[];
	sizes: ICatalog[];
	trademarks: ICatalog[];
	setupPrices: ICatalogSetupPrice[];
}

export const ContextProduct = createContext<IContextProduct>({
	categorys: [],
	colors: [],
	sizes: [],
	trademarks: [],
	setupPrices: [],
});
