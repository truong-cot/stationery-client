import Image from 'next/image';
import styles from './BannerImage.module.scss';
import type {PropsBannerImage} from './interfaces';

function BannerImage({image}: PropsBannerImage) {
	return (
		<div className={styles.banner_image}>
			<Image alt='Ảnh banner' src={image} fill />
		</div>
	);
}

export default BannerImage;
