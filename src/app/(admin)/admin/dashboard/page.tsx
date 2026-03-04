import {Metadata} from 'next';
import {Fragment} from 'react';

export const metadata: Metadata = {
	title: 'Admin dashboard',
	description: 'Admin dashboard',
};

export default function Page() {
	return (
		<Fragment>
			<h4>Admin dashboard page</h4>
		</Fragment>
	);
}
