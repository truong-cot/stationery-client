'use client';

import {useMemo, useRef, useState} from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import {ArrowLeft2, ArrowRight2, Maximize4, GallerySlash, ShieldTick} from 'iconsax-react';
import lgShare from 'lightgallery/plugins/share';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';

import styles from './ProductImages.module.scss';
import type {PropsProductImages} from './interfaces';

function ProductImages({images = []}: PropsProductImages) {
	const refLightGallery = useRef<any>(null);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const validImages = useMemo(() => {
		if (!images || !Array.isArray(images)) return [];
		return images.filter(Boolean);
	}, [images]);

	const lightGalleryItems = useMemo(
		() =>
			validImages.map((img, index) => ({
				src: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				thumb: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				subHtml: `Ảnh sản phẩm ${index + 1}`,
				downloadUrl: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
			})),
		[validImages]
	);

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
	};

	const handleOpenZoom = (index?: number) => {
		const targetIndex = typeof index === 'number' ? index : activeIndex;
		if (refLightGallery.current && validImages.length > 0) {
			refLightGallery.current.openGallery(targetIndex);
		}
	};

	return (
		<div className={styles.wrapper}>
			{/* Hidden LightGallery container */}
			{validImages.length > 0 && (
				<LightGallery
					dynamic
					dynamicEl={lightGalleryItems}
					download={true}
					plugins={[lgZoom, lgShare]}
					speed={400}
					onInit={(detail: any) => {
						refLightGallery.current = detail.instance;
					}}
				/>
			)}

			{/* Main Big Image Preview */}
			<div className={styles.main_box} onClick={() => handleOpenZoom()}>
				{validImages.length > 0 ? (
					<>
						<Image
							id='product-detail-main-img'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${validImages[activeIndex]}`}
							alt={`Ảnh sản phẩm ${activeIndex + 1}`}
							fill
							priority
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px'
							className={styles.main_image}
						/>

						{/* Badge */}
						<div className={styles.badge_trust}>
							<ShieldTick size='14' color='#00b7c4' variant='Bold' />
							<span>Chính hãng</span>
						</div>

						{/* Zoom Trigger Button */}
						<button
							type='button'
							className={styles.btn_zoom}
							onClick={(e) => {
								e.stopPropagation();
								handleOpenZoom();
							}}
							title='Xem ảnh kích thước lớn'
							aria-label='Phóng to ảnh'
						>
							<Maximize4 size='16' color='#374151' />
							<span>Phóng to</span>
						</button>

						{/* Prev / Next Nav Buttons */}
						{validImages.length > 1 && (
							<>
								<button
									type='button'
									className={clsx(styles.nav_btn, styles.prev)}
									onClick={handlePrev}
									aria-label='Ảnh trước'
								>
									<ArrowLeft2 size='18' color='#1f2937' />
								</button>
								<button
									type='button'
									className={clsx(styles.nav_btn, styles.next)}
									onClick={handleNext}
									aria-label='Ảnh kế tiếp'
								>
									<ArrowRight2 size='18' color='#1f2937' />
								</button>
								<div className={styles.counter_pill}>
									{activeIndex + 1} / {validImages.length}
								</div>
							</>
						)}
					</>
				) : (
					<div className={styles.no_image}>
						<GallerySlash size='48' color='#9ca3af' variant='Bulk' />
						<p>Hình ảnh đang được cập nhật</p>
					</div>
				)}
			</div>

			{/* Thumbnail Strip */}
			{validImages.length > 1 && (
				<div className={styles.thumb_strip}>
					{validImages.map((img, idx) => (
						<button
							key={idx}
							type='button'
							className={clsx(styles.thumb_item, {
								[styles.active]: idx === activeIndex,
							})}
							onClick={() => setActiveIndex(idx)}
							onMouseEnter={() => setActiveIndex(idx)}
							aria-label={`Chọn ảnh ${idx + 1}`}
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE}/${img}`}
								alt={`Thumbnail ${idx + 1}`}
								fill
								sizes='72px'
								className={styles.thumb_img}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default ProductImages;
