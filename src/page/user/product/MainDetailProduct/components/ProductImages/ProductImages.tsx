'use client';

import Image from 'next/image';
import {useMemo, useRef} from 'react';
import styles from './ProductImages.module.scss';
import type {PropsProductImages} from './interfaces';

import lgShare from 'lightgallery/plugins/share';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';

function ProductImages({images}: PropsProductImages) {
	const refLightGallery = useRef<any>(null);

	const arrayImages: string[] = useMemo(() => {
		if (images.length == 0) return [];

		return images.slice(1, 4);
	}, [images]);

	const lightGalleryItems = useMemo(
		() =>
			images.map((img, index) => ({
				src: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				thumb: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				subHtml: `Ảnh sản phẩm ${index + 1}`,
				downloadUrl: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
			})),
		[images]
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
			{images.length == 1 && (
				<div className={styles.image_single} onClick={() => refLightGallery.current?.openGallery(0)}>
					<Image src={`${process.env.NEXT_PUBLIC_IMAGE}/${images?.[0]}`} alt='Ảnh sản phẩm' fill style={{objectFit: 'cover'}} />
				</div>
			)}

			{images.length > 1 && (
				<div className={styles.product_images}>
					<div className={styles.image_left}>
						{arrayImages?.map((img, idx) => (
							<div key={idx} className={styles.image} onClick={() => refLightGallery.current?.openGallery(idx + 1)}>
								<Image
									alt='Ảnh sản phẩm'
									src={`${process.env.NEXT_PUBLIC_IMAGE}/${img}`}
									fill
									style={{objectFit: 'cover'}}
								/>
								{idx == 2 && images?.length > 4 && (
									<div className={styles.box_count}>
										<p>+{images?.length - 4}</p>
									</div>
								)}
							</div>
						))}
					</div>
					<div className={styles.image_right}>
						<div className={styles.image} onClick={() => refLightGallery.current?.openGallery(0)}>
							<Image
								alt='Ảnh sản phẩm'
								src={`${process.env.NEXT_PUBLIC_IMAGE}/${images?.[0]}`}
								fill
								style={{objectFit: 'cover'}}
							/>
						</div>
					</div>
				</div>
			)}
		</LightGallery>
	);
}

export default ProductImages;
