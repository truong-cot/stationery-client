import {Metadata} from 'next';
import {Suspense} from 'react';
import MainSize from '~/page/admin/size/MainSize';

export const metadata: Metadata = {
	title: 'Quản lý kích cỡ',
	description: 'Quản lý kích cỡ',
};

export default function Page() {
	return (
		<Suspense>
			<MainSize />
		</Suspense>
	);
}
