import {Metadata} from 'next';
import {Suspense} from 'react';
import {buildHomePageProductsSEO, SITE_URL} from '~/funcs/seo';
import MainProduct from '~/page/user/product/MainProduct';

export async function generateMetadata(): Promise<Metadata> {
	const seo = await buildHomePageProductsSEO();

	return {
		title: seo.title,
		description: seo.description,
		alternates: {
			canonical: `${SITE_URL}/product`,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-image-preview': 'large',
			},
		},
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: `${SITE_URL}/product`,
			siteName: 'Danh sách sản phẩm',
			images: [
				{
					url: seo.image,
					width: 1200,
					height: 630,
					alt: seo.title,
				},
			],
			locale: 'vi_VN',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: seo.title,
			description: seo.description,
			images: [seo.image],
		},
		other: {
			'script:ld+json': JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'WebPage',
				name: seo.title,
				description: seo.description,
				url: `${SITE_URL}/product`,
			}),
		},
	};
}

export default function Page() {
	return (
		<Suspense>
			<MainProduct />
		</Suspense>
	);
}
