import {createContext, Dispatch, SetStateAction} from 'react';

export interface IContextForm<T> {
	form: T;
	setForm: Dispatch<SetStateAction<T>>;
	errorText: Record<keyof T, string | null>;
	setErrorText: Dispatch<SetStateAction<Record<keyof T, string | null>>>;
	setValidate: Dispatch<SetStateAction<Record<keyof T, boolean> | null>>;
	countValidate: number;
	setCountValidate: Dispatch<SetStateAction<number>>;
	isDone: boolean;
}

export const ContextForm = createContext<IContextForm<any>>({
	form: {} as any,
	setForm: () => {},
	errorText: {},
	setErrorText: () => {},
	setValidate: () => {},
	countValidate: 0,
	setCountValidate: () => {},
	isDone: false,
});
