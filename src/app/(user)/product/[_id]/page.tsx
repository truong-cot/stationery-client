import {Metadata} from 'next';
import {Suspense} from 'react';
import {ProductJsonLd} from '~/contexts/ProductJsonLd';
import {buildProductDetailSEO, SITE_URL} from '~/funcs/seo';
import MainDetailProduct from '~/page/user/product/MainDetailProduct';
import {getProductDetail} from '~/services/client.service';

type PageProps = {
	params: Promise<{_id: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {_id} = await params;

	const product = await getProductDetail(_id);
	const seo = await buildProductDetailSEO(product);

	return {
		title: seo.title,
		description: seo.description,
		alternates: {
			canonical: `${SITE_URL}/product/${_id}`,
		},
		keywords: ['văn phòng phẩm', 'văn phòng phẩm Huyền Anh', product?.name, product?.category?.name],
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: `${SITE_URL}/product/${_id}`,
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
	};
}

export default async function Page({params}: PageProps) {
	const {_id} = await params;

	const product = await getProductDetail(_id);

	return (
		<Suspense>
			<ProductJsonLd product={product} />
			<MainDetailProduct product={product} />
		</Suspense>
	);
}
