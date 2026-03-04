import {Metadata} from 'next';
import {Suspense} from 'react';
import MainSetupPrice from '~/page/admin/setup-price/MainSetupPrice';

export const metadata: Metadata = {
	title: 'Quản lý khoảng giá',
	description: 'Quản lý khoảng giá',
};

export default function Page() {
	return (
		<Suspense>
			<MainSetupPrice />
		</Suspense>
	);
}
