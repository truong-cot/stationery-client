import Image from 'next/image';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import styles from './ProductOrder.module.scss';
import type {PropsProductOrder} from './interfaces';

function ProductOrder({order}: PropsProductOrder) {
	const {product, quantity} = order;

	const getImageUrl = (image?: string) => {
		if (!image) return '/images/banner-home.jpg';
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<div className={styles.product_order}>
			<Link href={`${PATH.Product}/${product._id}`} className={styles.image_wrap}>
				<Image src={getImageUrl(product.image)} alt={product.name} fill sizes='64px' className={styles.img} />
			</Link>

			<div className={styles.info}>
				<Link href={`${PATH.Product}/${product._id}`} className={styles.name}>
					{product.name}
				</Link>
				{product.pack_size && <span className={styles.pack_size}>{product.pack_size}</span>}
				<div className={styles.meta}>
					<span className={styles.quantity}>
						{quantity} x <span>{convertCoin(product.price)}₫</span>
					</span>
					<strong className={styles.subtotal}>{convertCoin(product.price * quantity)}₫</strong>
				</div>
			</div>
		</div>
	);
}

export default ProductOrder;

