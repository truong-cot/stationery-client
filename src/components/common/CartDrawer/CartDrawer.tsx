'use client';

import clsx from 'clsx';
import {ArrowRight, ShoppingCart, Trash} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {BsCartXFill} from 'react-icons/bs';
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
			map[item.product._id] = String(item.quantity);
		});
		setQuantities(map);
	}, [carts]);

	const getQuantity = (productId: string) => quantities[productId] ?? '0';

	const totalQuantity = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.quantity, 0);
	}, [carts]);

	const totalPrice = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
			width={520}
			title={
				<div className={styles.drawer_title}>
					<ShoppingCart size='22' color='#00b7c4' variant='Bold' />
					<span>Giỏ hàng của bạn</span>
					{carts.length > 0 && <span className={styles.title_badge}>{carts.length}</span>}
				</div>
			}
			actions={
				<div>
					<Button p_8_16 rounded_8 white bold div onClick={onClose}>
						Đóng
					</Button>
				</div>
			}
		>
			<div className={styles.cart_drawer}>
				{carts.length > 0 ? (
					<>
						<div className={styles.list_items}>
							{carts.map((item) => {
								const product = item.product;
								const currentQty = getQuantity(product._id);

								return (
									<div key={product._id} className={styles.cart_item}>
										<Link href={`${PATH.Product}/${product._id}`} className={styles.item_image} onClick={onClose}>
											<Image
												src={getImageUrl(product.image)}
												alt={product.name}
												fill
												sizes='76px'
												className={styles.img}
											/>
										</Link>

										<div className={styles.item_info}>
											<div className={styles.item_head}>
												<Link
													href={`${PATH.Product}/${product._id}`}
													className={styles.item_name}
													onClick={onClose}
												>
													{product.name}
												</Link>
												<button
													type='button'
													className={styles.btn_delete}
													onClick={() => dispatch(removeFromCart(product._id))}
													title='Xóa khỏi giỏ hàng'
													aria-label='Xóa khỏi giỏ hàng'
												>
													<Trash size='18' color='#d92d20' />
												</button>
											</div>

											{product.pack_size && <span className={styles.pack_size}>{product.pack_size}</span>}

											<div className={styles.item_bottom}>
												<div className={styles.price_group}>
													<span className={styles.unit_price}>{convertCoin(product.price)}₫</span>
													<span className={styles.line_total}>
														Thành tiền: <strong>{convertCoin(product.price * item.quantity)}₫</strong>
													</span>
												</div>

												<div className={styles.qty_control}>
													<button
														type='button'
														className={clsx(styles.action, {
															[styles.disable]: Number(currentQty) === 0,
														})}
														onClick={() => dispatch(decreaseQuantity(product._id))}
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
																	[product._id]: value,
																}));
															}
														}}
														onBlur={() => {
															const raw = quantities[product._id];
															let value = Number(raw);
															if (!raw || isNaN(value) || value < 0) value = 0;

															setQuantities((prev) => ({
																...prev,
																[product._id]: String(value),
															}));

															dispatch(
																updateQuantity({
																	productId: product._id,
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
														onClick={() => dispatch(increaseQuantity(product._id))}
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
								<span>Số loại sản phẩm</span>
								<strong>{carts.length} sản phẩm</strong>
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
