'use client';

import Image from 'next/image';
import LayoutGrid from '~/components/layout/LayoutGrid';
import SearchProduct from '~/components/layout/LayoutUser/components/SearchProduct';
import images from '~/constants/images/images';
import useWindowWidth from '~/hooks/useWindowWidth';
import styles from './BannerHome.module.scss';
import type {PropsBannerHome} from './interfaces';

function BannerHome({}: PropsBannerHome) {
	const width = useWindowWidth({debounceMs: 0});

	return (
		<LayoutGrid>
			<section className={styles.main_banner}>
				{width > 1200 ? (
					<div className={styles.image_banner}>
						<Image src={images.bannerHome} alt={`Ảnh banner`} fill style={{objectFit: 'cover'}} priority={true} />
					</div>
				) : (
					<div className={styles.search}>
						<SearchProduct widthFull={true} hiddenFilterCategory={true} />
					</div>
				)}
			</section>
		</LayoutGrid>
	);
}

export default BannerHome;
