'use client';

import clsx from 'clsx';
import {ArrowRight, ShoppingCart, Trash} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {BsCartXFill} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import Button from '~/components/common/Button';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {RootState} from '~/store';
import {decreaseQuantity, increaseQuantity, removeFromCart, updateQuantity} from '~/store/cart.slice';
import styles from './CartDrawer.module.scss';
import type {PropsCartDrawer} from './interfaces';

function CartDrawer({onClose}: PropsCartDrawer) {
	const router = useRouter();
	const dispatch = useDispatch();

	const {carts} = useSelector((state: RootState) => state.cart);
	const {contact} = useSelector((state: RootState) => state.user);

	const [quantities, setQuantities] = useState<Record<string, string>>({});

	useEffect(() => {
		const map: Record<string, string> = {};
		carts.forEach((item) => {
			map[item.cartItemId] = String(item.quantity);
		});
		setQuantities(map);
	}, [carts]);

	const getQuantity = (cartItemId: string) => quantities[cartItemId] ?? '0';

	const totalQuantity = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.quantity, 0);
	}, [carts]);

	const totalPrice = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}, [carts]);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	const getImageUrl = (image?: string) => {
		if (!image) return '/images/banner-home.jpg';
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<WrapperFormPostion
			width={400}
			title={
				<div className={styles.drawer_title}>
					<ShoppingCart size='22' color='#00b7c4' variant='Bold' />
					<span>Giỏ hàng của bạn</span>
				</div>
			}
			actions={
				<button
					type='button'
					className={styles.btn_close_drawer}
					onClick={onClose}
					title='Đóng giỏ hàng'
					aria-label='Đóng giỏ hàng'
				>
					<IoClose size={20} />
				</button>
			}
		>
			<div className={styles.cart_drawer}>
				{carts.length > 0 ? (
					<>
						<div className={styles.list_items}>
							{carts.map((item) => {
								const currentQty = getQuantity(item.cartItemId);

								return (
									<div key={item.cartItemId} className={styles.cart_item}>
										<Link href={`${PATH.Product}/${item.product_id}`} className={styles.item_image} onClick={onClose}>
											<Image
												src={getImageUrl(item.product_image)}
												alt={item.product_name}
												fill
												sizes='76px'
												className={styles.img}
											/>
										</Link>

										<div className={styles.item_info}>
											<div className={styles.item_head}>
												<Link
													href={`${PATH.Product}/${item.product_id}`}
													className={styles.item_name}
													onClick={onClose}
												>
													{item.product_name}
												</Link>
												<button
													type='button'
													className={styles.btn_delete}
													onClick={() => dispatch(removeFromCart(item.cartItemId))}
													title='Xóa khỏi giỏ hàng'
													aria-label='Xóa khỏi giỏ hàng'
												>
													<Trash size='18' color='#d92d20' />
												</button>
											</div>

											<div className={styles.tags_row}>
												{item.classify_name && (
													<span className={styles.classify_badge}>Phân loại: {item.classify_name}</span>
												)}
												{item.pack_size && <span className={styles.pack_size}>{item.pack_size}</span>}
											</div>

											<div className={styles.item_bottom}>
												<div className={styles.price_group}>
													<span className={styles.unit_price}>{convertCoin(item.price)}₫</span>
													<span className={styles.line_total}>
														Thành tiền: <strong>{convertCoin(item.price * item.quantity)}₫</strong>
													</span>
												</div>

												<div className={styles.qty_control}>
													<button
														type='button'
														className={clsx(styles.action, {
															[styles.disable]: Number(currentQty) <= 1,
														})}
														onClick={() => dispatch(decreaseQuantity(item.cartItemId))}
														aria-label='Giảm số lượng'
													>
														-
													</button>
													<input
														type='text'
														className={styles.input}
														value={currentQty}
														onChange={(e) => {
															const value = e.target.value;
															if (value === '' || /^\d+$/.test(value)) {
																setQuantities((prev) => ({
																	...prev,
																	[item.cartItemId]: value,
																}));
															}
														}}
														onBlur={() => {
															const raw = quantities[item.cartItemId];
															let value = Number(raw);
															if (!raw || isNaN(value) || value < 1) value = 1;

															setQuantities((prev) => ({
																...prev,
																[item.cartItemId]: String(value),
															}));

															dispatch(
																updateQuantity({
																	cartItemId: item.cartItemId,
																	quantity: value,
																})
															);
														}}
														onKeyDown={(e) => {
															if (['e', 'E', '+', '-', '.'].includes(e.key)) {
																e.preventDefault();
															}
														}}
														aria-label='Số lượng sản phẩm'
													/>
													<button
														type='button'
														className={styles.action}
														onClick={() => dispatch(increaseQuantity(item.cartItemId))}
														aria-label='Tăng số lượng'
													>
														+
													</button>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<div className={styles.summary}>
							<div className={styles.summary_row}>
								<span>Số loại mặt hàng</span>
								<strong>{carts.length} mặt hàng</strong>
							</div>
							<div className={styles.summary_row}>
								<span>Tổng số lượng</span>
								<strong>{totalQuantity}</strong>
							</div>
							<div className={styles.divider} />
							<div className={clsx(styles.summary_row, styles.total_row)}>
								<span>Tổng cộng</span>
								<span className={styles.total_price}>{convertCoin(totalPrice)}₫</span>
							</div>
							<div className={styles.buy_btn_wrap}>
								<Button
									p_10_24
									rounded_8
									bright-cyan
									bold
									icon={<ArrowRight size='18' color='#fff' />}
									onClick={() => {
										onClose();
										router.push(PATH.Order);
									}}
								>
									Mua hàng
								</Button>
							</div>
							<div className={styles.hotline_note}>
								Cần hỗ trợ đặt hàng? Liên hệ Hotline: <a href={`tel:${phoneNumber}`}>{formattedPhone}</a>
							</div>
						</div>
					</>
				) : (
					<div className={styles.empty}>
						<div className={styles.icon_empty}>
							<BsCartXFill size={36} color='#d92d20' />
						</div>
						<h4>Giỏ hàng đang trống!</h4>
						<p>Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm văn phòng phẩm chất lượng nhé!</p>
						<div className={styles.empty_btn}>
							<Button p_10_24 rounded_24 bright-cyan bold href={PATH.Product} onClick={onClose}>
								Khám phá sản phẩm
							</Button>
						</div>
					</div>
				)}
			</div>
		</WrapperFormPostion>
	);
}

export default CartDrawer;
