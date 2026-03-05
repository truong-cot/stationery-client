import {Metadata} from 'next';
import {Suspense} from 'react';
import MainHome from '~/page/user/MainHome';

export const metadata: Metadata = {
	title: 'Trang chủ',
	description: 'Trang chủ',
};

export default function Page() {
	return (
		<Suspense>
			<MainHome />
		</Suspense>
	);
}
