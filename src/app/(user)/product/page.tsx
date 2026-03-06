import {Metadata} from 'next';
import {Suspense} from 'react';
import MainProduct from '~/page/user/product/MainProduct';

export const metadata: Metadata = {
	title: 'Trang chủ',
	description: 'Trang chủ',
};

export default function Page() {
	return (
		<Suspense>
			<MainProduct />
		</Suspense>
	);
}
