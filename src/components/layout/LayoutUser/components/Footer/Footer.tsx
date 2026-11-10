'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useSelector} from 'react-redux';
import Tippy from '@tippyjs/react';
import {Facebook, Instagram, Sms, Youtube} from 'iconsax-reactjs';
import {Call, Location, Clock, ShieldTick, TruckFast, Receipt2} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import {RootState} from '~/store';
import {formatPhoneVN} from '~/funcs/optionConvert';
import styles from './Footer.module.scss';
import type {PropsFooter} from './interfaces';

function Footer({}: PropsFooter) {
	const {contact} = useSelector((state: RootState) => state.user);

	const phone = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phone);
	const address = contact?.address || 'Vĩnh Tường, Vĩnh Phúc';
	const email = contact?.email || 'vpphuyenanh@gmail.com';

	return (
		<footer className={styles.footer}>
			{/* Top Value Badges Section */}
			<div className={styles.badges_section}>
				<LayoutGrid>
					<div className={styles.badges_grid}>
						<div className={styles.badge_item}>
							<div className={styles.badge_icon}>
								<ShieldTick size='24' color='#00b7c4' variant='Bold' />
							</div>
							<div className={styles.badge_info}>
								<h4>Sản phẩm chính hãng</h4>
								<p>Cam kết 100% chất lượng xuất xứ rõ ràng</p>
							</div>
						</div>

						<div className={styles.badge_item}>
							<div className={styles.badge_icon}>
								<TruckFast size='24' color='#00b7c4' variant='Bold' />
							</div>
							<div className={styles.badge_info}>
								<h4>Giao hàng nhanh chóng</h4>
								<p>Đóng gói cẩn thận, vận chuyển toàn quốc</p>
							</div>
						</div>

						<div className={styles.badge_item}>
							<div className={styles.badge_icon}>
								<Receipt2 size='24' color='#00b7c4' variant='Bold' />
							</div>
							<div className={styles.badge_info}>
								<h4>Hỗ trợ xuất hóa đơn</h4>
								<p>Hỗ trợ xuất hóa đơn cho công ty, trường học</p>
							</div>
						</div>
					</div>
				</LayoutGrid>
			</div>

			{/* Main Footer Information Columns */}
			<div className={styles.main_section}>
				<LayoutGrid>
					<div className={styles.footer_grid}>
						{/* Column 1: Brand Info */}
						<div className={styles.col_brand}>
							<Link href={PATH.Home} className={styles.footer_logo}>
								<Image
									alt='Logo Văn phòng phẩm Huyền Anh'
									src={icons.logo}
									width={200}
									height={46}
									className={styles.logo_img}
								/>
							</Link>
							<p className={styles.brand_desc}>
								Văn phòng phẩm Huyền Anh - Đối tác cung cấp đồ dùng học tập, vật tư văn phòng, sổ sách, bút viết và quà lưu
								niệm chất lượng cao, giá thành cạnh tranh nhất khu vực.
							</p>
						</div>

						{/* Column 2: Quick Links */}
						<div className={styles.col}>
							<h4 className={styles.col_title}>Danh mục sản phẩm</h4>
							<ul className={styles.link_list}>
								<li>
									<Link href={`${PATH.Product}?_keyword=bút`}>Bút viết & Bút dạ</Link>
								</li>
								<li>
									<Link href={`${PATH.Product}?_keyword=giấy`}>Giấy in & Bìa các loại</Link>
								</li>
								<li>
									<Link href={`${PATH.Product}?_keyword=sổ`}>Sổ tay & Vở học sinh</Link>
								</li>
								<li>
									<Link href={`${PATH.Product}?_keyword=kéo`}>Dụng cụ văn phòng & Kéo</Link>
								</li>
								<li>
									<Link href={PATH.Product}>Tất cả sản phẩm</Link>
								</li>
							</ul>
						</div>

						{/* Column 3: Customer Care & Services */}
						<div className={styles.col}>
							<h4 className={styles.col_title}>Hỗ trợ khách hàng</h4>
							<ul className={styles.link_list}>
								<li>
									<Link href={PATH.TrackingOrder}>Tra cứu đơn hàng</Link>
								</li>
								<li>
									<Link href={PATH.Product}>Chính sách đặt hàng</Link>
								</li>
								<li>
									<Link href={PATH.Product}>Chính sách đổi trả hàng</Link>
								</li>
								<li>
									<Link href={PATH.Product}>Hóa đơn & Thanh toán</Link>
								</li>
								<li>
									<Link href={PATH.Product}>Báo giá sỉ cho trường học, cơ quan</Link>
								</li>
							</ul>
						</div>

						{/* Column 4: Contact & Social */}
						<div className={styles.col}>
							<h4 className={styles.col_title}>Thông tin liên hệ</h4>
							<ul className={styles.contact_list}>
								<li className={styles.contact_item}>
									<Call size='18' color='#00b7c4' />
									<a href={`tel:${phone}`}>{formattedPhone}</a>
								</li>
								<li className={styles.contact_item}>
									<Sms size='18' color='#00b7c4' />
									<a href={`mailto:${email}`}>{email}</a>
								</li>
								<li className={styles.contact_item}>
									<Location size='18' color='#00b7c4' />
									<span>{address}</span>
								</li>
								<li className={styles.contact_item}>
									<Clock size='18' color='#00b7c4' />
									<span>Thứ 2 - Chủ Nhật (7:30 - 21:30)</span>
								</li>
							</ul>

							{/* Social Icons */}
							<div className={styles.social_wrap}>
								{contact?.facebook && (
									<Tippy content='Facebook'>
										<Link
											href={contact.facebook}
											target='_blank'
											rel='noopener noreferrer'
											className={styles.social_btn}
										>
											<Facebook variant='Bold' size={18} />
										</Link>
									</Tippy>
								)}
								{contact?.instagram && (
									<Tippy content='Instagram'>
										<Link
											href={contact.instagram}
											target='_blank'
											rel='noopener noreferrer'
											className={styles.social_btn}
										>
											<Instagram variant='Bold' size={18} />
										</Link>
									</Tippy>
								)}
								{contact?.youtube && (
									<Tippy content='Youtube'>
										<Link
											href={contact.youtube}
											target='_blank'
											rel='noopener noreferrer'
											className={styles.social_btn}
										>
											<Youtube variant='Bold' size={18} />
										</Link>
									</Tippy>
								)}
							</div>
						</div>
					</div>
				</LayoutGrid>
			</div>

			{/* Copyright Bar */}
			<div className={styles.bottom_bar}>
				<LayoutGrid>
					<div className={styles.copyright_wrap}>
						<p>Văn phòng phẩm Huyền Anh. Tất cả các quyền được bảo lưu.</p>
						<p className={styles.tax_notice}>© 2025 Đặng Bá Trường (033 994 0200)</p>
					</div>
				</LayoutGrid>
			</div>
		</footer>
	);
}

export default Footer;
