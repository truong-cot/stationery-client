import {Metadata} from 'next';
import {Suspense} from 'react';
import {buildPageTrackingOrderSEO, seoKeywords, SITE_URL} from '~/funcs/seo';
import MainTrackingOrder from '~/page/user/order/MainTrackingOrder';

export async function generateMetadata(): Promise<Metadata> {
	const seo = await buildPageTrackingOrderSEO();

	return {
		title: seo.title,
		description: seo.description,
		keywords: seoKeywords,
		alternates: {
			canonical: `${SITE_URL}/tracking-order`,
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default function Page() {
	return (
		<Suspense>
			<MainTrackingOrder />
		</Suspense>
	);
}

