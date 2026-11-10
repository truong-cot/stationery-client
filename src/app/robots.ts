import type {MetadataRoute} from 'next';
import {SITE_URL} from '~/funcs/seo';

export default function robots(): MetadataRoute.Robots {
	const siteUrl = SITE_URL || 'https://vanphongphamhuyenanh.org';

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/admin/', '/login', '/api/'],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}

