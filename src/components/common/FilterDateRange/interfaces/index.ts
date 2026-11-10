import {Dispatch, SetStateAction} from 'react';
import {TYPE_DATE} from '~/constants/config/enum';

export interface PropsFilterDateRange {
	hiddenOptionAll?: boolean;
	date: {
		from: Date | null;
		to: Date | null;
	} | null;
	setDate: Dispatch<SetStateAction<{from: Date | null; to: Date | null} | null>>;
	typeDate: TYPE_DATE;
	setTypeDate: Dispatch<SetStateAction<TYPE_DATE>>;
	name?: string;
}
