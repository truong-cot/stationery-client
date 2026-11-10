import {Metadata} from 'next';
import {Suspense} from 'react';
import MainOrder from '~/page/admin/order/MainOrder';

export const metadata: Metadata = {
	title: 'Quản lý đơn hàng',
	description: 'Quản lý đơn hàng phân hệ Admin',
};

export default function Page() {
	return (
		<Suspense>
			<MainOrder />
		</Suspense>
	);
}

