import LayoutAuth from "~/components/layout/LayoutAuth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutAuth>{children}</LayoutAuth>;
}
