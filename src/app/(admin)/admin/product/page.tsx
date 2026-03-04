import {Metadata} from 'next';
import {Suspense} from 'react';
import MainProduct from '~/page/admin/product/MainProduct';

export const metadata: Metadata = {
	title: 'Quản lý sản phẩm',
	description: 'Quản lý sản phẩm',
};

export default function Page() {
	return (
		<Suspense>
			<MainProduct />
		</Suspense>
	);
}
