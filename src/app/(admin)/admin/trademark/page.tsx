import {Metadata} from 'next';
import {Suspense} from 'react';
import MainTrademark from '~/page/admin/trademark/MainTrademark';

export const metadata: Metadata = {
	title: 'Quản lý thương hiệu',
	description: 'Quản lý thương hiệu',
};

export default function Page() {
	return (
		<Suspense>
			<MainTrademark />
		</Suspense>
	);
}
