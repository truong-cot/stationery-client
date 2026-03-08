import {Metadata} from 'next';
import {Suspense} from 'react';
import {buildHomePageSEO, seoKeywords, SITE_URL} from '~/funcs/seo';
import BannerHome from '~/page/user/home/BannerHome';
import CategoryHome from '~/page/user/home/CategoryHome';
import FeaturedProducts from '~/page/user/home/FeaturedProducts';
import NewProducts from '~/page/user/home/NewProducts';

export async function generateMetadata(): Promise<Metadata> {
	const seo = await buildHomePageSEO();

	return {
		title: seo.title,
		description: seo.description,
		alternates: {
			canonical: SITE_URL,
		},
		keywords: seoKeywords,
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
			url: SITE_URL,
			siteName: 'Văn phòng phẩm Huyền Anh',
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
				url: SITE_URL,
			}),
		},
	};
}

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
