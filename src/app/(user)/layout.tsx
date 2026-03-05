import LayoutUser from '~/components/layout/LayoutUser';

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <LayoutUser>{children}</LayoutUser>;
}
