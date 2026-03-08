import {Category2, Colorfilter, Size, TriangleLogo} from 'iconsax-react';
import styles from './ProductInfo.module.scss';
import type {PropsProductInfo} from './interfaces';
import {convertCoin} from '~/funcs/convertCoin';

function ProductInfo({product}: PropsProductInfo) {
	return (
		<div className={styles.main}>
			<p className={styles.code}>
				Mã sản phẩm: <span>#{product?.code}</span>
			</p>
			<h4 className={styles.name}>{product?.name}</h4>
			<div className={styles.item}>
				<Category2 size={18} color='#25c173' variant='Bold' />
				<p className={styles.text}>
					Danh mục: <span>{product?.category?.name}</span>
				</p>
			</div>
			<div className={styles.item}>
				<Colorfilter size={18} color='#25c173' variant='Bold' />
				<p className={styles.text}>
					Màu sắc: <span>{product?.color?.name || 'Đang cập nhật!'}</span>
				</p>
			</div>
			<div className={styles.item}>
				<Size size={18} color='#25c173' variant='Bold' />
				<p className={styles.text}>
					Kích cỡ: <span>{product?.size?.name || 'Đang cập nhật!'}</span>
				</p>
			</div>
			<div className={styles.item}>
				<TriangleLogo size={18} color='#25c173' variant='Bold' />
				<p className={styles.text}>
					Thương hiệu: <span>{product?.trademark?.name || 'Đang cập nhật!'}</span>
				</p>
			</div>

			<p className={styles.description}>{product?.short_description}</p>

			<h4 className={styles.price}>Giá: {convertCoin(product?.price)}đ</h4>

			<p className={styles.contact}>
				Gọi ngay <b>033.492.8394</b> để có được tư vấn tốt nhất!
			</p>
		</div>
	);
}

export default ProductInfo;
