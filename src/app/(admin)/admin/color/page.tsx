import {Metadata} from 'next';
import {Suspense} from 'react';
import MainColor from '~/page/admin/color/MainColor';

export const metadata: Metadata = {
	title: 'Quản lý màu sắc',
	description: 'Quản lý màu sắc',
};

export default function Page() {
	return (
		<Suspense>
			<MainColor />
		</Suspense>
	);
}
