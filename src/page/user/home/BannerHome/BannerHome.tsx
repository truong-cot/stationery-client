'use client';

import Image from 'next/image';
import LayoutGrid from '~/components/layout/LayoutGrid';
import images from '~/constants/images/images';
import styles from './BannerHome.module.scss';
import type {PropsBannerHome} from './interfaces';
import useWindowWidth from '~/hooks/useWindowWidth';
import {useMemo} from 'react';
import Slider from 'react-slick';

function BannerHome({}: PropsBannerHome) {
	const width = useWindowWidth({debounceMs: 0});

	const sliders = useMemo(() => [images.slider1, images.slider3, images.slider2, images.slider4], []);

	const sliderSettings = useMemo(
		() => ({
			slidesToShow: 1,
			swipeToSlide: true,
			arrows: false,
			dots: true,
			autoplay: true,
			autoplaySpeed: 3000,
			speed: 800,
			pauseOnHover: true,
			pauseOnFocus: true,
			adaptiveHeight: true,
			appendDots: (dots: React.ReactNode) => (
				<div className={styles.custom_dots}>
					<ul>{dots}</ul>
				</div>
			),
			customPaging: () => (
				<button className={styles.dot}>
					<span />
				</button>
			),
		}),
		[]
	);

	return (
		<LayoutGrid>
			<section className={styles.main_banner}>
				{width > 1200 ? (
					<div className={styles.image_banner}>
						<Image src={images.bannerHome} alt={`Ảnh banner`} fill style={{objectFit: 'cover'}} priority={true} />
					</div>
				) : (
					<div className={styles.slider}>
						<Slider {...sliderSettings}>
							{sliders.map((image, idx) => (
								<div key={idx} className={styles.image}>
									<Image
										src={image}
										alt={`Ảnh banner ${idx + 1}`}
										fill
										style={{objectFit: 'cover'}}
										priority={idx === 0}
									/>
								</div>
							))}
						</Slider>
					</div>
				)}
			</section>
		</LayoutGrid>
	);
}

export default BannerHome;
