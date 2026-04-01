'use client';

import {Category2, Colorfilter, Size, TriangleLogo} from 'iconsax-react';
import styles from './ProductInfo.module.scss';
import type {PropsProductInfo} from './interfaces';
import {convertCoin} from '~/funcs/convertCoin';
import {useSelector} from 'react-redux';
import {RootState} from '~/store';
import {formatPhoneVN} from '~/funcs/optionConvert';
import Adsense from '~/components/seo/Adsense';

function ProductInfo({product}: PropsProductInfo) {
	const {contact} = useSelector((state: RootState) => state.user);

	return (
		<div className={styles.main}>
			<h4 className={styles.name}>{product?.name}</h4>
			<p className={styles.code}>
				Kích thước đóng gói: <span>{product?.pack_size}</span>
			</p>
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
				Gọi ngay <b>{formatPhoneVN(contact?.phone) || 'Đang cập nhật!'}</b> để có được tư vấn tốt nhất!
			</p>

			<Adsense slot='9269273552' />
		</div>
	);
}

export default ProductInfo;
