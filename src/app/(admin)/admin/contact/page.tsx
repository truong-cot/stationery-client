import {Metadata} from 'next';
import {Suspense} from 'react';
import FormUpdateContact from '~/page/admin/contact/FormUpdateContact';

export const metadata: Metadata = {
	title: 'Thông tin liên hệ',
	description: 'Thông tin liên hệ',
};

export default function Page() {
	return (
		<Suspense>
			<FormUpdateContact />
		</Suspense>
	);
}
