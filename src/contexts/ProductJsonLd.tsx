import {DEFAULT_OG_IMAGE, SITE_URL} from '~/funcs/seo';
import {IProductDetail} from '~/page/user/product/MainDetailProduct/interfaces';

export function ProductJsonLd({product}: {product: IProductDetail}) {
	const siteUrl = SITE_URL || 'https://vanphongphamhuyenanh.org';
	const imageBase = process.env.NEXT_PUBLIC_IMAGE;

	const images = (product?.images ?? []).map((img) => (img.startsWith('http') || img.startsWith('data:') ? img : `${imageBase}/${img}`));

	if (images.length === 0) {
		images.push(DEFAULT_OG_IMAGE);
	}

	const productSchema = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		image: images,
		description:
			product.short_description ||
			`${product.name} chính hãng tại Văn phòng phẩm Huyền Anh. Quy cách: ${product.pack_size || 'Tiêu chuẩn'}.`,
		sku: product._id,
		mpn: product._id,
		brand: {
			'@type': 'Brand',
			name: product?.trademark?.name || 'Văn phòng phẩm Huyền Anh',
		},
		category: product?.category?.name || 'Văn phòng phẩm',
		offers: {
			'@type': 'Offer',
			priceCurrency: 'VND',
			price: product.price || 0,
			priceValidUntil: '2027-12-31',
			itemCondition: 'https://schema.org/NewCondition',
			availability: 'https://schema.org/InStock',
			url: `${siteUrl}/product/${product._id}`,
			seller: {
				'@type': 'Organization',
				name: 'Văn phòng phẩm Huyền Anh',
			},
		},
	};

	const breadcrumbElements = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'Trang chủ',
			item: siteUrl,
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: 'Danh sách sản phẩm',
			item: `${siteUrl}/product`,
		},
	];

	if (product?.category?._id) {
		breadcrumbElements.push({
			'@type': 'ListItem',
			position: 3,
			name: product.category.name,
			item: `${siteUrl}/product?_categoryId=${product.category._id}`,
		});
		breadcrumbElements.push({
			'@type': 'ListItem',
			position: 4,
			name: product.name,
			item: `${siteUrl}/product/${product._id}`,
		});
	} else {
		breadcrumbElements.push({
			'@type': 'ListItem',
			position: 3,
			name: product.name,
			item: `${siteUrl}/product/${product._id}`,
		});
	}

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbElements,
	};

	return (
		<>
			<script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}} />
			<script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
		</>
	);
}
