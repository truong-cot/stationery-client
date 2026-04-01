import {MetadataRoute} from 'next';
import {PATH} from '~/constants/config';
import {SITE_URL} from '~/funcs/seo';

// async function getProducts() {
// 	try {
// 		const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
// 			cache: 'no-store', // hoặc 'force-cache' nếu data ít thay đổi
// 		});

// 		if (!res.ok) return [];

// 		const data = await res.json();

// 		return data?.items || []; // tùy structure API của bạn
// 	} catch (error) {
// 		return [];
// 	}
// }

export default async function sitemap() {
	// const products = await getProducts();

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: SITE_URL,
			lastModified: new Date(),
		},
		{
			url: `${SITE_URL}${PATH.Product}`,
			lastModified: new Date(),
		},
	];

	// 👉 Dynamic product routes
	// const productRoutes: MetadataRoute.Sitemap = products.map((product: {uuid: string; updatedAt?: string}) => ({
	// 	url: `${SITE_URL}${PATH.PRODUCT}/${product.uuid}`,
	// 	lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
	// }));

	// return [...staticRoutes, ...productRoutes];

	return staticRoutes;
}
