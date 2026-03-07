import {Metadata} from 'next';
import {Suspense} from 'react';
import BannerHome from '~/page/user/home/BannerHome';
import CategoryHome from '~/page/user/home/CategoryHome';
import FeaturedProducts from '~/page/user/home/FeaturedProducts';
import NewProducts from '~/page/user/home/NewProducts';

export const metadata: Metadata = {
	title: 'Trang chủ',
	description: 'Trang chủ',
};

export default function Page() {
	return (
		<Suspense>
			<BannerHome />
			<CategoryHome />
			<FeaturedProducts />
			<NewProducts />
		</Suspense>
	);
}
