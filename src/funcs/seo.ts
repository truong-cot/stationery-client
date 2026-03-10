import {IProductDetail} from '~/page/user/product/MainDetailProduct/interfaces';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/image-seo.jpg`;

export const seoKeywords: string[] = [
	'văn phòng phẩm',
	'văn phòng phẩm Huyền Anh',
	'shop văn phòng phẩm',
	'shop văn phòng phẩm Huyền Anh',
	'website thương mại điện tử văn phòng phẩm Huyền Anh',
	'khám phá sản phẩm văn phòng phẩm',
	'tra cứu sản phẩm văn phòng phẩm',
	'văn phòng phẩm giá tốt',
];

export async function buildHomePageSEO() {
	const title = 'Tìm kiếm, tra cứu thông tin sản phẩm văn phòng phẩm giá tốt.';

	const description = 'Danh sách danh mục, sản phẩm nổi bật và sản phẩm mới nhất tại Văn phòng phẩm Huyền Anh';

	return {title, description, image: DEFAULT_OG_IMAGE};
}

export async function buildHomePageProductsSEO() {
	const title = 'Danh sách sản phẩm';

	const description = 'Tìm kiếm, tra cứu danh sách sản phẩm tại Văn phòng phẩm Huyền Anh';

	return {title, description, image: DEFAULT_OG_IMAGE};
}

export async function buildProductDetailSEO(product: IProductDetail) {
	const category = product.category;
	const price = product.price ? `${product.price.toLocaleString('vi-VN')}₫` : 'Giá tốt';

	const title = `${product.name}  | ${category?.name} | ${product.pack_size} – ${price}`;

	const description = `${product.name} - Danh mục: ${category?.name} | Kích thước đóng gói: ${product.pack_size} - Giá: ${price}.`.trim();

	return {
		title,
		description,
		image: product?.images?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE}/${product?.images[0]}` : DEFAULT_OG_IMAGE,
	};
}
