import {Metadata} from 'next';
import {Suspense} from 'react';
import MainCreateProduct from '~/page/admin/product/MainCreateProduct';

export const metadata: Metadata = {
	title: 'Thêm mới sản phẩm',
	description: 'Thêm mới sản phẩm',
};

export default function Page() {
	return (
		<Suspense>
			<MainCreateProduct />
		</Suspense>
	);
}
