import {Metadata} from 'next';
import {Suspense} from 'react';
import MainClassify from '~/page/admin/classify/MainClassify';

export const metadata: Metadata = {
	title: 'Quản lý phân loại',
	description: 'Quản lý phân loại',
};

export default function Page() {
	return (
		<Suspense>
			<MainClassify />
		</Suspense>
	);
}
