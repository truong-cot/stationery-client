'use client';

import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ShoppingCart, Call, ShieldSecurity, TruckFast, Receipt2, Flash, Shop} from 'iconsax-react';

import {flyToCart} from '~/hooks/flyToCart';
import {toastSuccess} from '~/funcs/toast';
import {convertCoin} from '~/funcs/convertCoin';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {RootState} from '~/store';
import {addToCart, setOpenCart} from '~/store/cart.slice';
import styles from './ProductInfo.module.scss';
import type {PropsProductInfo} from './interfaces';

function ProductInfo({product}: PropsProductInfo) {
	const dispatch = useDispatch();
	const {contact} = useSelector((state: RootState) => state.user);
	const [quantity, setQuantity] = useState<number>(1);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	const handleDecrease = () => {
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const handleIncrease = () => {
		setQuantity((prev) => prev + 1);
	};

	const dispatchAddToCart = () => {
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
	};

	const handleAddToCart = () => {
		const imgEl = document.querySelector('#product-detail-main-img') as HTMLImageElement | null;
		const cartEl = document.querySelector('#cart-icon') as HTMLElement | null;

		if (imgEl && cartEl) {
			flyToCart(imgEl, cartEl);
		}

		dispatchAddToCart();
		toastSuccess({
			msg: `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`,
		});
	};

	const handleBuyNow = () => {
		dispatchAddToCart();
		dispatch(setOpenCart(true));
	};

	const colorList = product?.colors && product.colors.length > 0 ? product.colors : product?.color ? [product.color] : [];

	return (
		<div className={styles.main}>
			{/* Top Meta: Brand & SKU */}
			<div className={styles.top_meta}>
				{product?.trademark?.name ? (
					<span className={styles.brand_pill}>
						<Shop size='14' color='#00b7c4' variant='Bold' />
						Thương hiệu: <strong>{product.trademark.name}</strong>
					</span>
				) : (
					<span className={styles.brand_pill}>
						<Shop size='14' color='#00b7c4' variant='Bold' />
						Văn phòng phẩm Huyền Anh
					</span>
				)}

				<span className={styles.stock_status}>
					<span className={styles.stock_dot} />
					Còn hàng
				</span>
			</div>

			{/* Product Title */}
			<h1 className={styles.name}>{product?.name}</h1>

			{/* Sub-meta badges */}
			{(product?.pack_size || product?.category?.name) && (
				<div className={styles.meta_tags}>
					{product?.pack_size && (
						<span className={styles.pack_badge}>
							Đóng gói: <strong>{product.pack_size}</strong>
						</span>
					)}
					{product?.category?.name && <span className={styles.cat_badge}>Loại: {product.category.name}</span>}
				</div>
			)}

			{/* Price Box */}
			<div className={styles.price_box}>
				<div className={styles.price_main_row}>
					<span className={styles.price_val}>{convertCoin(product?.price || 0)}₫</span>
				</div>
			</div>

			{/* Color List (Display Only) */}
			{colorList.length > 0 && (
				<div className={styles.attr_section}>
					<span className={styles.attr_label}>Màu sắc:</span>
					<div className={styles.color_pills}>
						{colorList.map((c) => (
							<span key={c._id} className={styles.color_tag}>
								{c.name}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Quantity Stepper & Add to cart button */}
			<div className={styles.purchase_area}>
				<div className={styles.quantity_wrapper}>
					<span className={styles.attr_label}>Số lượng:</span>
					<div className={styles.stepper}>
						<button type='button' className={styles.stepper_btn} onClick={handleDecrease} aria-label='Giảm số lượng'>
							-
						</button>
						<span className={styles.stepper_val}>{quantity}</span>
						<button type='button' className={styles.stepper_btn} onClick={handleIncrease} aria-label='Tăng số lượng'>
							+
						</button>
					</div>
				</div>

				<div className={styles.action_buttons}>
					<button type='button' className={styles.btn_add_cart} onClick={handleAddToCart}>
						<ShoppingCart size='18' color='#00b7c4' variant='Bold' />
						<span>Thêm vào giỏ</span>
					</button>

					<button type='button' className={styles.btn_buy_now} onClick={handleBuyNow}>
						<Flash size='18' color='#fff' variant='Bold' />
						<span>Mua ngay</span>
					</button>
				</div>
			</div>

			{/* Fast Hotline Contact for Wholesale */}
			<div className={styles.contact_box}>
				<div className={styles.contact_icon}>
					<Call size='20' color='#ffffff' variant='Bold' />
				</div>
				<div className={styles.contact_content}>
					<p className={styles.contact_title}>Cần tư vấn đặt hàng sỉ & hợp đồng định kỳ?</p>
					<a href={`tel:${phoneNumber}`} className={styles.contact_phone}>
						Hotline / Zalo: <strong>{formattedPhone}</strong>
					</a>
				</div>
			</div>

			{/* Trust Guarantees */}
			<div className={styles.guarantee_grid}>
				<div className={styles.guarantee_item}>
					<div className={styles.g_icon}>
						<ShieldSecurity size='18' color='#10b981' variant='Bold' />
					</div>
					<div>
						<p className={styles.g_title}>100% Chính hãng</p>
						<p className={styles.g_sub}>Đổi mới trong 7 ngày nếu có lỗi từ NSX</p>
					</div>
				</div>
				<div className={styles.guarantee_item}>
					<div className={styles.g_icon}>
						<Receipt2 size='18' color='#00b7c4' variant='Bold' />
					</div>
					<div>
						<p className={styles.g_title}>Hỗ trợ xuất hóa đơn</p>
						<p className={styles.g_sub}>Theo yêu cầu cho công ty, trường học & cơ quan</p>
					</div>
				</div>
				<div className={styles.guarantee_item}>
					<div className={styles.g_icon}>
						<TruckFast size='18' color='#f59e0b' variant='Bold' />
					</div>
					<div>
						<p className={styles.g_title}>Giao hàng nhanh</p>
						<p className={styles.g_sub}>Đóng gói cẩn thận, đồng kiểm khi nhận hàng</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductInfo;
