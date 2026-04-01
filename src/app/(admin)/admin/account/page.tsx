import {Metadata} from 'next';
import {Suspense} from 'react';
import MainAccount from '~/page/admin/account/MainAccount';

export const metadata: Metadata = {
	title: 'Quản lý tài khoản',
	description: 'Quản lý tài khoản',
};

export default function Page() {
	return (
		<Suspense>
			<MainAccount />
		</Suspense>
	);
}
