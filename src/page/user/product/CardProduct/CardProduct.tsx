import Image from 'next/image';
import styles from './CardProduct.module.scss';
import type {PropsCardProduct} from './interfaces';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {convertCoin} from '~/funcs/convertCoin';

function CardProduct({product}: PropsCardProduct) {
	return (
		<div className={styles.card_product}>
			<div className={styles.box_image}>
				<Image
					alt='Ảnh sản phẩm'
					src={`${process.env.NEXT_PUBLIC_IMAGE}/${product?.images?.[0]}`}
					fill
					style={{borderRadius: '4px 4px 0 0'}}
				/>
			</div>
			<div className={styles.info}>
				<Tippy content={product?.name}>
					<Link href={'#'} className={styles.name}>
						{product?.name}
					</Link>
				</Tippy>
				<p className={styles.code}>Mã số: {product?.code}</p>
				<p className={styles.price}>{convertCoin(product?.price || 0)} ₫</p>
			</div>
		</div>
	);
}

export default CardProduct;
