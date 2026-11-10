import {Metadata} from 'next';
import {Suspense} from 'react';
import {buildPageOrderSEO, seoKeywords, SITE_URL} from '~/funcs/seo';
import MainOrder from '~/page/user/order/MainOrder';

export async function generateMetadata(): Promise<Metadata> {
	const seo = await buildPageOrderSEO();

	return {
		title: seo.title,
		description: seo.description,
		keywords: seoKeywords,
		alternates: {
			canonical: `${SITE_URL}/order`,
		},
		robots: {
			index: false,
			follow: true,
		},
	};
}

export default function Page() {
	return (
		<Suspense>
			<MainOrder />
		</Suspense>
	);
}

