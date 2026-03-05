import Image from 'next/image';
import {useMemo, useRef} from 'react';
import styles from './InfoDetail.module.scss';

import clsx from 'clsx';
import FlexLayout from '~/components/layout/FlexLayout';

import lgShare from 'lightgallery/plugins/share';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import {PropsInfoDetail} from './interfaces';

function InfoDetail({name, value, textColor, images = [], actions, isMarginTop, widthImage = 80, heightImage = 80}: PropsInfoDetail) {
	const refLightGallery = useRef<any>(null);

	const lightGalleryItems = useMemo(
		() =>
			images.map((img, index) => ({
				src: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				thumb: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				subHtml: `${name} ${index + 1}`,
			})),
		[images]
	);

	return (
		<div className={clsx(styles.info_detail, {[styles.margin_top]: isMarginTop})}>
			<p className={styles.name}>{name}</p>

			{images.length > 0 ? (
				<LightGallery
					dynamic
					dynamicEl={lightGalleryItems}
					plugins={[lgZoom, lgShare]}
					speed={500}
					onInit={(detail: any) => {
						refLightGallery.current = detail.instance;
					}}
				>
					<FlexLayout row gap-6 wrap>
						{images.map((image, index) => (
							<div key={index} onClick={() => refLightGallery.current?.openGallery(index)}>
								<Image
									unoptimized
									src={`${process.env.NEXT_PUBLIC_IMAGE}/${image}`}
									alt={`Ảnh chi tiết ${index + 1}`}
									width={widthImage}
									height={heightImage}
									loading='lazy'
									style={{
										cursor: 'pointer',
										borderRadius: 8,
										objectFit: 'cover',
									}}
								/>
							</div>
						))}
					</FlexLayout>
				</LightGallery>
			) : (
				<div style={{color: textColor && !actions ? textColor : undefined}} className={styles.value}>
					{actions || value || '---'}
				</div>
			)}
		</div>
	);
}

export default InfoDetail;
