import type {Metadata} from 'next';
import LayoutAdmin from '~/components/layout/LayoutAdmin';

export const metadata: Metadata = {
	title: 'Quản trị hệ thống',
	robots: {
		index: false,
		follow: false,
		nocache: true,
	},
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <LayoutAdmin>{children}</LayoutAdmin>;
}
