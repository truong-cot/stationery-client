import type {Metadata} from 'next';
import LayoutAuth from '~/components/layout/LayoutAuth';

export const metadata: Metadata = {
	title: 'Đăng nhập',
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
	return <LayoutAuth>{children}</LayoutAuth>;
}
