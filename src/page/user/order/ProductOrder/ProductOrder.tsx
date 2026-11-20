import Image from 'next/image';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import styles from './ProductOrder.module.scss';
import type {PropsProductOrder} from './interfaces';

function ProductOrder({order}: PropsProductOrder) {
	const {product_id, product_name, product_image, pack_size, classify_name, price, quantity} = order;

	const getImageUrl = (image?: string) => {
		if (!image) return '/images/banner-home.jpg';
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<div className={styles.product_order}>
			<Link href={`${PATH.Product}/${product_id}`} className={styles.image_wrap}>
				<Image src={getImageUrl(product_image)} alt={product_name} fill sizes='64px' className={styles.img} />
			</Link>

			<div className={styles.info}>
				<Link href={`${PATH.Product}/${product_id}`} className={styles.name}>
					{product_name}
				</Link>

				<div className={styles.tags_row}>
					{classify_name && <span className={styles.classify_badge}>Phân loại: {classify_name}</span>}
					{pack_size && <span className={styles.pack_size}>{pack_size}</span>}
				</div>

				<div className={styles.meta}>
					<span className={styles.quantity}>
						{quantity} x <span>{convertCoin(price)}₫</span>
					</span>
					<strong className={styles.subtotal}>{convertCoin(price * quantity)}₫</strong>
				</div>
			</div>
		</div>
	);
}

export default ProductOrder;
