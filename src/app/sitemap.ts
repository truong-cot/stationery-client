import type {MetadataRoute} from 'next';
import {PATH} from '~/constants/config';
import {SITE_URL} from '~/funcs/seo';

interface IProductItem {
	_id: string;
	name: string;
	updated_at?: string;
	created_at?: string;
}

interface ICategoryItem {
	_id: string;
	name: string;
	children?: ICategoryItem[];
}

async function getAllProducts(): Promise<IProductItem[]> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const res = await fetch(`${apiUrl}/client/page-list-product`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({page: 1, pageSize: 500}),
			next: {revalidate: 3600}, // revalidate hourly
		});

		if (!res.ok) return [];
		const data = await res.json();
		return data?.data?.items || [];
	} catch (error) {
		console.error('Sitemap product fetch error:', error);
		return [];
	}
}

async function getAllCategories(): Promise<ICategoryItem[]> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const res = await fetch(`${apiUrl}/client/tree-category`, {
			next: {revalidate: 3600},
		});

		if (!res.ok) return [];
		const data = await res.json();
		return data?.data || [];
	} catch (error) {
		console.error('Sitemap category fetch error:', error);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = SITE_URL || 'https://vanphongphamhuyenanh.org';

	// 1. Static Core Routes
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		},
		{
			url: `${siteUrl}${PATH.Product}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
	];

	// 2. Dynamic Product Detail Pages
	const products = await getAllProducts();
	const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
		url: `${siteUrl}${PATH.Product}/${product._id}`,
		lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
		changeFrequency: 'weekly',
		priority: 0.8,
	}));

	// 3. Dynamic Category Filter Pages
	const categories = await getAllCategories();
	const categoryList: ICategoryItem[] = [];
	const flattenCategories = (cats: ICategoryItem[]) => {
		for (const cat of cats) {
			categoryList.push(cat);
			if (cat.children && cat.children.length > 0) {
				flattenCategories(cat.children);
			}
		}
	};
	flattenCategories(categories);

	const categoryRoutes: MetadataRoute.Sitemap = categoryList.map((cat) => ({
		url: `${siteUrl}${PATH.Product}?_categoryId=${cat._id}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.7,
	}));

	return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

