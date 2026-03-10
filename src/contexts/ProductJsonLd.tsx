import {SITE_URL} from '~/funcs/seo';
import {IProductDetail} from '~/page/user/product/MainDetailProduct/interfaces';

export function ProductJsonLd({product}: {product: IProductDetail}) {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		image: product.images,
		description: product.short_description,
		sku: product.pack_size,
		offers: {
			'@type': 'Offer',
			priceCurrency: 'VND',
			price: product.price,
			availability: 'https://schema.org/InStock',
			url: `${SITE_URL}/product/${product._id}`,
		},
	};

	return <script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />;
}
