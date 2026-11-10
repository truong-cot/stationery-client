'use client';

import clsx from 'clsx';
import {Call, LockSlash, ReceiptSearch, ShoppingCart} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import {Fragment, useEffect, useRef, useState} from 'react';
import LayoutGrid from '~/components/layout/LayoutGrid';
import PositionContainer from '~/components/common/PositionContainer';
import CartDrawer from '~/components/common/CartDrawer';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import styles from './Header.module.scss';
import type {PropsHeader} from './interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {setOpenCart} from '~/store/cart.slice';
import {formatPhoneVN} from '~/funcs/optionConvert';
import Tippy from '@tippyjs/react';

function Header({}: PropsHeader) {
	const dispatch = useDispatch();
	const {contact} = useSelector((state: RootState) => state.user);
	const {carts, isOpenCart} = useSelector((state: RootState) => state.cart);

	const [animate, setAnimate] = useState<boolean>(false);
	const isFirstRender = useRef<boolean>(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		setAnimate(true);
		const timeout = setTimeout(() => setAnimate(false), 300);

		return () => clearTimeout(timeout);
	}, [carts]);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	return (
		<Fragment>
			<div className={styles.wrapper_header}>
				<LayoutGrid>
					<div className={styles.main_header}>
						{/* Logo */}
						<Link href={PATH.Home} className={styles.logo_link}>
							<Image
								alt='Văn phòng phẩm Huyền Anh'
								src={icons.logo}
								width={200}
								height={46}
								priority
								className={styles.logo_img}
							/>
						</Link>

						{/* Right actions */}
						<div className={styles.right_actions}>
							{/* Phone Hotline */}
							<a href={`tel:${phoneNumber}`} className={styles.phone_item} title={`Hotline: ${formattedPhone}`}>
								<div className={styles.phone_icon}>
									<Call size='18' color='#fff' variant='Bold' />
								</div>
								<div className={styles.phone_info}>
									<span className={styles.phone_label}>Hotline hỗ trợ</span>
									<span className={styles.phone_num}>{formattedPhone}</span>
								</div>
							</a>

							{/* Tracking Order */}
							<Tippy content='Tra cứu đơn hàng'>
								<Link href={PATH.TrackingOrder} className={styles.tracking_btn} aria-label='Tra cứu đơn hàng'>
									<ReceiptSearch size='18' color='#00b7c4' />
									<span className={styles.tracking_label}>Tra cứu đơn</span>
								</Link>
							</Tippy>

							{/* Cart icon */}
							<Tippy content='Giỏ hàng của bạn'>
								<button
									type='button'
									id='cart-icon'
									className={styles.cart_btn}
									onClick={() => dispatch(setOpenCart(true))}
									aria-label='Giỏ hàng'
								>
									<div className={styles.cart_icon_wrap}>
										<ShoppingCart size='20' color='#00b7c4' variant='Bold' />
										<span className={clsx(styles.cart_badge, {[styles.bump]: animate})}>{carts.length}</span>
									</div>
									<span className={styles.cart_label}>Giỏ hàng</span>
								</button>
							</Tippy>

							{/* Admin Link */}
							<Tippy content='Truy cập trang Quản trị'>
								<Link href={PATH.AuthLogin} className={styles.admin_btn}>
									<LockSlash size='18' color='#fff' variant='Bold' />
									<span className={styles.admin_label}>Quản trị viên</span>
								</Link>
							</Tippy>
						</div>
					</div>
				</LayoutGrid>
			</div>

			<PositionContainer open={isOpenCart} onClose={() => dispatch(setOpenCart(false))}>
				<CartDrawer onClose={() => dispatch(setOpenCart(false))} />
			</PositionContainer>
		</Fragment>
	);
}

export default Header;
