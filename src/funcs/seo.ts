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
	'đồ dùng học sinh',
	'dụng cụ học tập',
	'bút viết',
	'giấy in a4',
	'vở vẽ',
	'kéo',
	'văn phòng phẩm giá sỉ',
];

export async function buildHomePageSEO() {
	const title = 'Văn phòng phẩm Huyền Anh - Đồ dùng học tập & văn phòng phẩm giá tốt';

	const description =
		'Văn phòng phẩm Huyền Anh chuyên cung cấp sỉ lẻ đồ dùng học tập, thiết bị văn phòng phẩm, bút viết, giấy in, sổ vở chính hãng với giá cả cạnh tranh, giao hàng nhanh chóng.';

	return {title, description, image: DEFAULT_OG_IMAGE};
}

export async function buildHomePageProductsSEO() {
	const title = 'Danh sách sản phẩm văn phòng phẩm giá tốt';

	const description =
		'Khám phá danh sách đầy đủ các sản phẩm dụng cụ học tập, thiết bị văn phòng phẩm, bút viết, giấy in chất lượng cao tại Văn phòng phẩm Huyền Anh.';

	return {title, description, image: DEFAULT_OG_IMAGE};
}

export async function buildPageOrderSEO() {
	const title = 'Đặt mua hàng';

	const description =
		'Hoàn tất thông tin giao hàng và xác nhận đặt mua sản phẩm văn phòng phẩm chính hãng tại Văn phòng phẩm Huyền Anh.';

	return {title, description, image: DEFAULT_OG_IMAGE};
}

export async function buildPageTrackingOrderSEO() {
	const title = 'Tra cứu đơn hàng';

	const description =
		'Tra cứu nhanh trạng thái và tiến độ xử lý đơn hàng bằng Số điện thoại hoặc Mã đơn hàng tại Văn phòng phẩm Huyền Anh.';

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
