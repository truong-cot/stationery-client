import {Metadata} from 'next';
import {Suspense} from 'react';
import MainUpdateProduct from '~/page/admin/product/MainUpdateProduct';

export const metadata: Metadata = {
	title: 'Chỉnh sửa sản phẩm',
	description: 'Chỉnh sửa sản phẩm',
};

export default function Page() {
	return (
		<Suspense>
			<MainUpdateProduct />
		</Suspense>
	);
}
