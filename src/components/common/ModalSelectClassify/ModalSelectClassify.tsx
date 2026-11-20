'use client';

import clsx from 'clsx';
import {CloseCircle, Flash, InfoCircle, ShoppingCart} from 'iconsax-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import Popup from '~/components/common/Popup';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import {toastSuccess, toastWarn} from '~/funcs/toast';
import {flyToCart} from '~/hooks/flyToCart';
import {addToCart, setOpenCart} from '~/store/cart.slice';
import styles from './ModalSelectClassify.module.scss';
import type {PropsModalSelectClassify} from './interfaces';

function ModalSelectClassify({open, onClose, product, anchorImgEl}: PropsModalSelectClassify) {
	const router = useRouter();
	const dispatch = useDispatch();

	const classifies = useMemo(() => product?.classifies || [], [product?.classifies]);

	// State lưu số lượng cho từng classify_id
	const [quantities, setQuantities] = useState<Record<string, number>>({});

	// Khi mở modal, khởi tạo: phân loại đầu tiên = 1, các phân loại khác = 0
	useEffect(() => {
		if (open && classifies.length > 0) {
			const initialMap: Record<string, number> = {};
			classifies.forEach((c, idx) => {
				initialMap[c._id] = idx === 0 ? 1 : 0;
			});
			setQuantities(initialMap);
		}
	}, [open, classifies]);

	const totalQuantity = useMemo(() => {
		return Object.values(quantities).reduce((sum, q) => sum + (Number(q) || 0), 0);
	}, [quantities]);

	const totalPrice = useMemo(() => {
		return totalQuantity * (product?.price || 0);
	}, [totalQuantity, product?.price]);

	const handleUpdateQty = (classifyId: string, val: number) => {
		setQuantities((prev) => ({
			...prev,
			[classifyId]: Math.max(0, val),
		}));
	};

	const getImageUrl = (img?: string) => {
		if (!img) return '/images/banner-home.jpg';
		if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${img}`;
	};

	const addSelectedItemsToCart = (): boolean => {
		const selectedList = classifies
			.map((c) => ({
				classify: c,
				quantity: quantities[c._id] || 0,
			}))
			.filter((item) => item.quantity > 0);

		if (selectedList.length === 0) {
			toastWarn({
				msg: 'Vui lòng chọn số lượng lớn hơn 0 cho ít nhất 1 phân loại!',
			});
			return false;
		}

		selectedList.forEach(({classify, quantity}) => {
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

		return true;
	};

	const handleAddToCart = () => {
		if (!addSelectedItemsToCart()) return;

		const cartEl =
			window.innerWidth <= 768
				? document.querySelector('#cart-bottom-icon') || document.querySelector('#cart-icon')
				: document.querySelector('#cart-icon');

		if (anchorImgEl && cartEl) {
			flyToCart(anchorImgEl, cartEl as HTMLElement);
		}

		toastSuccess({
			msg: `Đã thêm ${totalQuantity} sản phẩm "${product.name}" vào giỏ hàng!`,
		});

		onClose();
	};

	const handleBuyNow = () => {
		if (!addSelectedItemsToCart()) return;
		onClose();
		dispatch(setOpenCart(true));
	};

	return (
		<Popup open={open} onClose={onClose}>
			<div className={styles.modal}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.image_wrap}>
						<Image src={getImageUrl(product?.images?.[0])} alt={product?.name || 'Sản phẩm'} fill sizes='56px' />
					</div>

					<div className={styles.header_info}>
						<h4 className={styles.product_name}>{product?.name}</h4>
						<div className={styles.meta_row}>
							<span className={styles.price}>{convertCoin(product?.price || 0)}₫</span>
							{product?.pack_size && <span className={styles.pack_size}>{product.pack_size}</span>}
						</div>
					</div>

					<button type='button' className={styles.btn_close} onClick={onClose} aria-label='Đóng'>
						<CloseCircle size='20' variant='Bold' />
					</button>
				</div>

				{/* Body: Danh sách phân loại */}
				<div className={styles.body}>
					<div className={styles.guide_text}>
						<InfoCircle size='16' color='#00b7c4' variant='Bold' />
						<span>Chọn số lượng cho từng phân loại bạn muốn đặt:</span>
					</div>

					<div className={styles.classify_list}>
						{classifies.map((c) => {
							const currentQty = quantities[c._id] || 0;
							const rowSubtotal = currentQty * (product?.price || 0);

							return (
								<div key={c._id} className={clsx(styles.classify_row, {[styles.has_qty]: currentQty > 0})}>
									<div className={styles.classify_name_wrap}>
										<span className={styles.classify_tag}>{c.name}</span>
									</div>

									<div className={styles.classify_controls}>
										<div className={styles.stepper}>
											<button
												type='button'
												className={styles.stepper_btn}
												onClick={() => handleUpdateQty(c._id, currentQty - 1)}
												disabled={currentQty <= 0}
												aria-label='Giảm'
											>
												-
											</button>
											<input
												type='number'
												min={0}
												className={styles.stepper_input}
												value={currentQty}
												onChange={(e) => {
													const val = parseInt(e.target.value, 10);
													handleUpdateQty(c._id, isNaN(val) || val < 0 ? 0 : val);
												}}
											/>
											<button
												type='button'
												className={styles.stepper_btn}
												onClick={() => handleUpdateQty(c._id, currentQty + 1)}
												aria-label='Tăng'
											>
												+
											</button>
										</div>

										<div className={clsx(styles.row_subtotal, {[styles.active]: currentQty > 0})}>
											{currentQty > 0 ? `${convertCoin(rowSubtotal)}₫` : '0₫'}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Footer */}
				<div className={styles.footer}>
					<div className={styles.summary_row}>
						<span className={styles.summary_count}>
							Đã chọn: <strong>{totalQuantity}</strong> sản phẩm
						</span>
						<div className={styles.summary_total}>
							<span>Tổng tạm tính:</span>
							<strong>{convertCoin(totalPrice)}₫</strong>
						</div>
					</div>

					<div className={styles.actions}>
						<button type='button' className={styles.btn_buy} onClick={handleBuyNow} disabled={totalQuantity <= 0}>
							<Flash size='18' color='#ffffff' variant='Bold' />
							<span>Mua ngay</span>
						</button>
						<button type='button' className={styles.btn_add} onClick={handleAddToCart} disabled={totalQuantity <= 0}>
							<ShoppingCart size='18' color='#009aa6' variant='Bold' />
							<span>Thêm vào giỏ</span>
						</button>
					</div>
				</div>
			</div>
		</Popup>
	);
}

export default ModalSelectClassify;
