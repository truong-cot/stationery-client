import {Metadata} from 'next';
import {Suspense} from 'react';
import MainCategory from '~/page/admin/category/MainCategory';

export const metadata: Metadata = {
	title: 'Quản lý thương hiệu',
	description: 'Quản lý thương hiệu',
};

export default function Page() {
	return (
		<Suspense>
			<MainCategory />
		</Suspense>
	);
}
