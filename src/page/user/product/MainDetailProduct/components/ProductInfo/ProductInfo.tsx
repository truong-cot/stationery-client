'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {ShoppingCart, Call, ShieldSecurity, TruckFast, Receipt2, Flash, Shop, InfoCircle} from 'iconsax-react';
import clsx from 'clsx';

import {flyToCart} from '~/hooks/flyToCart';
import {toastSuccess, toastWarn} from '~/funcs/toast';
import {convertCoin} from '~/funcs/convertCoin';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {PATH} from '~/constants/config';
import {RootState} from '~/store';
import {addToCart, setOpenCart} from '~/store/cart.slice';
import styles from './ProductInfo.module.scss';
import type {PropsProductInfo} from './interfaces';

function ProductInfo({product}: PropsProductInfo) {
	const router = useRouter();
	const dispatch = useDispatch();
	const {contact} = useSelector((state: RootState) => state.user);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	const classifyList = useMemo(
		() => (product?.classifies && product.classifies.length > 0 ? product.classifies : []),
		[product?.classifies]
	);
	const hasClassifies = classifyList.length > 0;

	// Khi sản phẩm không có phân loại: dùng quantity đơn lẻ
	const [singleQuantity, setSingleQuantity] = useState<number>(1);

	// Khi sản phẩm CÓ phân loại: map lưu số lượng theo từng classify_id
	const [classifyQuantities, setClassifyQuantities] = useState<Record<string, number>>({});

	useEffect(() => {
		if (hasClassifies) {
			const initMap: Record<string, number> = {};
			classifyList.forEach((c, idx) => {
				initMap[c._id] = idx === 0 ? 1 : 0;
			});
			setClassifyQuantities(initMap);
		}
	}, [hasClassifies, classifyList]);

	const totalClassifyQty = useMemo(() => {
		return Object.values(classifyQuantities).reduce((sum, q) => sum + (Number(q) || 0), 0);
	}, [classifyQuantities]);

	const totalClassifyPrice = useMemo(() => {
		return totalClassifyQty * (product?.price || 0);
	}, [totalClassifyQty, product?.price]);

	const handleUpdateClassifyQty = (classifyId: string, val: number) => {
		setClassifyQuantities((prev) => ({
			...prev,
			[classifyId]: Math.max(0, val),
		}));
	};

	const triggerFlyToCart = () => {
		const imgEl = document.querySelector('#product-detail-main-img') as HTMLImageElement | null;
		const cartEl =
			window.innerWidth <= 768
				? ((document.querySelector('#cart-bottom-icon') as HTMLElement | null) ||
				  (document.querySelector('#cart-icon') as HTMLElement | null))
				: (document.querySelector('#cart-icon') as HTMLElement | null);

		if (imgEl && cartEl) {
			flyToCart(imgEl, cartEl);
		}
	};

	// Thêm vào giỏ hàng
	const handleAddToCart = () => {
		if (hasClassifies) {
			const selectedItems = classifyList
				.map((c) => ({
					classify: c,
					quantity: classifyQuantities[c._id] || 0,
				}))
				.filter((i) => i.quantity > 0);

			if (selectedItems.length === 0) {
				toastWarn({
					msg: 'Vui lòng chọn số lượng lớn hơn 0 cho ít nhất 1 phân loại hàng!',
				});
				return;
			}

			selectedItems.forEach(({classify, quantity}) => {
				const cartItemId = `${product._id}_${classify._id}`;
				dispatch(
					addToCart({
						cartItemId,
						product_id: product._id,
						product_name: product.name,
						product_image: product.images?.[0] || '',
						pack_size: product.pack_size || '',
						classify_id: classify._id,
						classify_name: classify.name,
						price: product.price,
						quantity,
					})
				);
			});

			triggerFlyToCart();
			toastSuccess({
				msg: `Đã thêm ${totalClassifyQty} sản phẩm (${selectedItems.length} phân loại) vào giỏ hàng!`,
			});
		} else {
			// Sản phẩm không phân loại
			if (singleQuantity <= 0) return;

			dispatch(
				addToCart({
					cartItemId: `${product._id}_default`,
					product_id: product._id,
					product_name: product.name,
					product_image: product.images?.[0] || '',
					pack_size: product.pack_size || '',
					classify_id: null,
					classify_name: null,
					price: product.price,
					quantity: singleQuantity,
				})
			);

			triggerFlyToCart();
			toastSuccess({
				msg: `Đã thêm ${singleQuantity} sản phẩm "${product.name}" vào giỏ hàng!`,
			});
		}
	};

	// Mua ngay
	const handleBuyNow = () => {
		if (hasClassifies) {
			const selectedItems = classifyList
				.map((c) => ({
					classify: c,
					quantity: classifyQuantities[c._id] || 0,
				}))
				.filter((i) => i.quantity > 0);

			if (selectedItems.length === 0) {
				toastWarn({
					msg: 'Vui lòng chọn số lượng lớn hơn 0 cho ít nhất 1 phân loại hàng!',
				});
				return;
			}

			selectedItems.forEach(({classify, quantity}) => {
				const cartItemId = `${product._id}_${classify._id}`;
				dispatch(
					addToCart({
						cartItemId,
						product_id: product._id,
						product_name: product.name,
						product_image: product.images?.[0] || '',
						pack_size: product.pack_size || '',
						classify_id: classify._id,
						classify_name: classify.name,
						price: product.price,
						quantity,
					})
				);
			});

			dispatch(setOpenCart(true));
		} else {
			// Sản phẩm không phân loại
			if (singleQuantity <= 0) return;

			dispatch(
				addToCart({
					cartItemId: `${product._id}_default`,
					product_id: product._id,
					product_name: product.name,
					product_image: product.images?.[0] || '',
					pack_size: product.pack_size || '',
					classify_id: null,
					classify_name: null,
					price: product.price,
					quantity: singleQuantity,
				})
			);

			dispatch(setOpenCart(true));
		}
	};

	return (
		<div className={styles.main}>
			{/* Top Meta: Brand & SKU */}
			<div className={styles.top_meta}>
				<span className={styles.brand_pill}>
					<Shop size='14' color='#00b7c4' variant='Bold' />
					Văn phòng phẩm Huyền Anh
				</span>

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

			{/* Danh sách phân loại & Bộ chọn số lượng */}
			{hasClassifies ? (
				<div className={styles.classify_bulk_container}>
					<div className={styles.classify_bulk_header}>
						<span>Chọn số lượng theo từng phân loại:</span>
						<span style={{fontSize: 12, fontWeight: 500, color: '#64748b'}}>
							(Đơn giá: {convertCoin(product?.price || 0)}₫)
						</span>
					</div>

					<div className={styles.classify_list_rows}>
						{classifyList.map((c) => {
							const currentQty = classifyQuantities[c._id] || 0;
							const rowSubtotal = currentQty * (product?.price || 0);

							return (
								<div key={c._id} className={clsx(styles.classify_item_row, {[styles.active_row]: currentQty > 0})}>
									<span className={styles.classify_name_text}>{c.name}</span>

									<div className={styles.classify_item_right}>
										<div className={styles.stepper}>
											<button
												type='button'
												className={styles.stepper_btn}
												onClick={() => handleUpdateClassifyQty(c._id, currentQty - 1)}
												disabled={currentQty <= 0}
												aria-label='Giảm số lượng'
											>
												-
											</button>
											<input
												type='number'
												min={0}
												style={{width: 44, textAlign: 'center', border: 'none', fontWeight: 700, fontSize: 13}}
												value={currentQty}
												onChange={(e) => {
													const val = parseInt(e.target.value, 10);
													handleUpdateClassifyQty(c._id, isNaN(val) || val < 0 ? 0 : val);
												}}
											/>
											<button
												type='button'
												className={styles.stepper_btn}
												onClick={() => handleUpdateClassifyQty(c._id, currentQty + 1)}
												aria-label='Tăng số lượng'
											>
												+
											</button>
										</div>

										<span className={clsx(styles.classify_subtotal, {[styles.active]: currentQty > 0})}>
											{currentQty > 0 ? `${convertCoin(rowSubtotal)}₫` : '0₫'}
										</span>
									</div>
								</div>
							);
						})}
					</div>

					<div className={styles.classify_summary_box}>
						<span className={styles.summary_count_badge}>
							Tổng số lượng: <strong>{totalClassifyQty}</strong> sản phẩm
						</span>
						<div className={styles.summary_total_text}>
							<span>Tổng tạm tính:</span>
							<strong>{convertCoin(totalClassifyPrice)}₫</strong>
						</div>
					</div>
				</div>
			) : (
				/* Khi sản phẩm không có phân loại: stepper số lượng đơn giản */
				<div className={styles.purchase_area}>
					<div className={styles.quantity_wrapper}>
						<span className={styles.attr_label}>Số lượng:</span>
						<div className={styles.stepper}>
							<button
								type='button'
								className={styles.stepper_btn}
								onClick={() => setSingleQuantity((prev) => Math.max(1, prev - 1))}
								aria-label='Giảm số lượng'
							>
								-
							</button>
							<span className={styles.stepper_val}>{singleQuantity}</span>
							<button
								type='button'
								className={styles.stepper_btn}
								onClick={() => setSingleQuantity((prev) => prev + 1)}
								aria-label='Tăng số lượng'
							>
								+
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Action Buttons: Thêm vào giỏ & Mua ngay */}
			<div className={styles.action_buttons}>
				<button
					type='button'
					className={styles.btn_add_cart}
					onClick={handleAddToCart}
					disabled={hasClassifies && totalClassifyQty <= 0}
				>
					<ShoppingCart size='18' color='#00b7c4' variant='Bold' />
					<span>Thêm vào giỏ</span>
				</button>

				<button
					type='button'
					className={styles.btn_buy_now}
					onClick={handleBuyNow}
					disabled={hasClassifies && totalClassifyQty <= 0}
				>
					<Flash size='18' color='#fff' variant='Bold' />
					<span>Mua ngay</span>
				</button>
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
