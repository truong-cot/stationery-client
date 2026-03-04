import {Dispatch, SetStateAction} from 'react';

export interface PropsEditerContent {
	label: React.ReactNode | string;
	content: string;
	setContent: Dispatch<SetStateAction<string>>;
	[props: string]: any;
}
