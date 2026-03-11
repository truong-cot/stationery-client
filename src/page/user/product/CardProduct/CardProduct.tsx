import Image from 'next/image';
import styles from './CardProduct.module.scss';
import type {PropsCardProduct} from './interfaces';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {convertCoin} from '~/funcs/convertCoin';
import {PATH} from '~/constants/config';
import {useMemo, useRef} from 'react';

import LightGallery from 'lightgallery/react';
import lgShare from 'lightgallery/plugins/share';
import lgZoom from 'lightgallery/plugins/zoom';

function CardProduct({product}: PropsCardProduct) {
	const refLightGallery = useRef<any>(null);

	const lightGalleryItems = useMemo(
		() =>
			product?.images?.map((img: string, index: number) => ({
				src: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				thumb: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				subHtml: `Ảnh sản phẩm ${index + 1}`,
				downloadUrl: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
			})) || [],
		[product?.images]
	);

	return (
		<LightGallery
			dynamic
			dynamicEl={lightGalleryItems}
			download={true}
			plugins={[lgZoom, lgShare]}
			speed={500}
			onInit={(detail: any) => {
				refLightGallery.current = detail.instance;
			}}
		>
			<div className={styles.card_product}>
				<div className={styles.box_image} onClick={() => refLightGallery.current?.openGallery(0)}>
					<Image
						alt='Ảnh sản phẩm'
						src={`${process.env.NEXT_PUBLIC_IMAGE}/${product?.images?.[0]}`}
						fill
						style={{borderRadius: '4px 4px 0 0'}}
					/>
				</div>
				<div className={styles.info}>
					<Tippy content={product?.name}>
						<Link href={`${PATH.Product}/${product?._id}`} className={styles.name}>
							{product?.name}
						</Link>
					</Tippy>
					<p className={styles.code}>{product?.pack_size}</p>
					<p className={styles.price}>{convertCoin(product?.price || 0)} ₫</p>
				</div>
			</div>
		</LightGallery>
	);
}

export default CardProduct;
