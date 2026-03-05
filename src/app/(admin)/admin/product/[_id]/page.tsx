import {Metadata} from 'next';
import {Suspense} from 'react';
import MainDetailProduct from '~/page/admin/product/MainDetailProduct';

export const metadata: Metadata = {
	title: 'Chi tiết sản phẩm',
	description: 'Chi tiết sản phẩm',
};

export default function Page() {
	return (
		<Suspense>
			<MainDetailProduct />
		</Suspense>
	);
}
