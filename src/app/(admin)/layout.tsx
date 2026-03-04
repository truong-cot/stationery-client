import LayoutAdmin from '~/components/layout/LayoutAdmin';

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <LayoutAdmin>{children}</LayoutAdmin>;
}
