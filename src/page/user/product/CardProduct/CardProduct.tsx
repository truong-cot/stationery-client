'use client';

import {useState, useMemo, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import {HeartTick, ShoppingCart, Eye} from 'iconsax-react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgShare from 'lightgallery/plugins/share';
import {useDispatch} from 'react-redux';

import {flyToCart} from '~/hooks/flyToCart';
import {addToCart} from '~/store/cart.slice';
import {toastSuccess} from '~/funcs/toast';
import {convertCoin} from '~/funcs/convertCoin';
import {PATH} from '~/constants/config';
import styles from './CardProduct.module.scss';
import type {PropsCardProduct} from './interfaces';

function CardProduct({product}: PropsCardProduct) {
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState<number>(1);
	const refLightGallery = useRef<any>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const lightGalleryItems = useMemo(
		() =>
			product?.images?.map((img: string, index: number) => ({
				src: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				thumb: `${process.env.NEXT_PUBLIC_IMAGE}/${img}`,
				subHtml: `<h4>${product.name}</h4><p>Ảnh ${index + 1}</p>`,
			})) || [],
		[product?.images, product?.name]
	);

	const handleDecrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const handleIncrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setQuantity((prev) => prev + 1);
	};

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const cartEl = document.querySelector('#cart-icon');
		if (imgRef.current && cartEl) {
			flyToCart(imgRef.current, cartEl as HTMLElement);
		}

		dispatch(
			addToCart({
				product: {
					_id: product._id,
					name: product.name,
					price: product.price,
					pack_size: product.pack_size,
					image: product.images?.[0] || '',
				},
				quantity,
			})
		);

		toastSuccess({
			msg: `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`,
		});
	};

	const handleOpenGallery = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		refLightGallery.current?.openGallery(0);
	};

	const primaryImage = product?.images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE}/${product.images[0]}` : '/images/banner-home.jpg';

	return (
		<div className={styles.card_product}>
			{/* Hidden LightGallery for zoom */}
			<div style={{display: 'none'}}>
				<LightGallery
					dynamic
					dynamicEl={lightGalleryItems}
					plugins={[lgZoom, lgShare]}
					speed={400}
					onInit={(detail: any) => {
						refLightGallery.current = detail.instance;
					}}
				/>
			</div>

			{/* Image container */}
			<div className={styles.box_image}>
				<Link href={`${PATH.Product}/${product?._id}`} className={styles.image_link}>
					<Image
						ref={imgRef}
						alt={product?.name || 'Ảnh sản phẩm'}
						src={primaryImage}
						fill
						sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
						className={styles.img}
					/>
				</Link>

				{/* Quick view image zoom button */}
				{product?.images && product.images.length > 0 && (
					<button
						type='button'
						aria-label='Phóng to ảnh'
						className={styles.btn_zoom}
						onClick={handleOpenGallery}
						title='Xem ảnh phóng to'
					>
						<Eye size='16' color='#1f2937' variant='Outline' />
					</button>
				)}

				{/* Featured badge */}
				{product?.is_featured && (
					<div className={styles.featured_badge} title='Sản phẩm nổi bật'>
						<HeartTick size='16' color='#ffffff' variant='Bold' />
						<span>Nổi bật</span>
					</div>
				)}
			</div>

			{/* Info section */}
			<div className={styles.info}>
				{/* Title (Single line) */}
				<Tippy content={product?.name || ''}>
					<Link href={`${PATH.Product}/${product?._id}`} className={styles.name}>
						{product?.name}
					</Link>
				</Tippy>

				{/* Pack size & Colors */}
				<div className={styles.meta_row}>
					{product?.pack_size && <span className={styles.pack_size_badge}>{product.pack_size}</span>}

					{product?.colors && product.colors.length > 0 && (
						<div className={styles.color_dots} title={`Màu: ${product.colors.map((c) => c.name).join(', ')}`}>
							{product.colors.slice(0, 5).map((c, idx) => (
								<Tippy key={c._id || idx} content={c.name}>
									<span className={styles.color_dot} style={{backgroundColor: c.code || '#00b7c4'}} />
								</Tippy>
							))}
							{product.colors.length > 5 && <span className={styles.color_more}>+{product.colors.length - 5}</span>}
						</div>
					)}
				</div>

				{/* Price */}
				<div className={styles.price_row}>
					<span className={styles.price}>{convertCoin(product?.price || 0)}₫</span>
				</div>

				{/* Action row matching Image 2 */}
				<div className={styles.action_row}>
					<button type='button' className={styles.btn_order} onClick={handleAddToCart}>
						<ShoppingCart size='15' color='#fff' variant='Bold' />
						<span>Đặt hàng</span>
					</button>

					<div className={styles.quantity_stepper}>
						<button type='button' className={styles.stepper_btn} onClick={handleDecrease} aria-label='Giảm số lượng'>
							-
						</button>
						<span className={styles.stepper_value}>{quantity}</span>
						<button type='button' className={styles.stepper_btn} onClick={handleIncrease} aria-label='Tăng số lượng'>
							+
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CardProduct;
