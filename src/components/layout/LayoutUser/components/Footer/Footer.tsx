'use client';

import Tippy from '@tippyjs/react';
import {Facebook, Instagram, Sms, Youtube} from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import LayoutGrid from '~/components/layout/LayoutGrid';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {RootState} from '~/store';
import styles from './Footer.module.scss';
import type {PropsFooter} from './interfaces';

function Footer({}: PropsFooter) {
	const {contact} = useSelector((state: RootState) => state.user);

	const hasContactText = contact?.phone || contact?.email || contact?.address;
	const hasSocialMedia = contact?.facebook || contact?.instagram || contact?.email || contact?.youtube;

	return (
		<footer className={styles.footer}>
			{/* Phần trên: Logo & Tiêu đề website */}
			<section className={styles.section}>
				<LayoutGrid>
					<Link href={PATH.Home} className={styles.logo_wrap}>
						<Image alt='Logo Văn phòng phẩm Huyền Anh' src={icons.logo} width={200} height={44} className={styles.logo_img} />
					</Link>
					<h4 className={styles.title}>Website thương mại điện tử Văn phòng phẩm Huyền Anh</h4>
				</LayoutGrid>
			</section>

			{/* Phần dưới: Thông tin liên hệ & Mạng xã hội */}
			<section className={styles.section}>
				<LayoutGrid>
					<div className={styles.copyright}>
						<div className={styles.text}>
							{contact?.phone && (
								<>
									<p>
										<span className={styles.text_label}>Điện thoại:</span>{' '}
										<a href={`tel:${contact.phone}`} className={styles.text_link}>
											{formatPhoneVN(contact.phone)}
										</a>
									</p>
									<p>
										<span className={styles.text_label}>Hotline:</span>{' '}
										<a href={`tel:${contact.phone}`} className={styles.text_link}>
											{formatPhoneVN(contact.phone)}
										</a>{' '}
										<span className={styles.text_sub}>(T2-CN)</span>
									</p>
								</>
							)}
							{contact?.email && (
								<p>
									<span className={styles.text_label}>Email:</span>{' '}
									<a href={`mailto:${contact.email}`} className={styles.text_link}>
										{contact.email}
									</a>
								</p>
							)}
							{contact?.address && (
								<p>
									<span className={styles.text_label}>Địa chỉ:</span> <span>{contact.address}</span>
								</p>
							)}

							{!hasContactText && <p>Văn phòng phẩm Huyền Anh</p>}
						</div>

						{hasSocialMedia && (
							<div className={styles.right}>
								<div className={styles.social_media}>
									{contact?.facebook && (
										<Tippy content='Facebook'>
											<Link
												href={contact.facebook}
												target='_blank'
												rel='noopener noreferrer'
												className={styles.social_media_item}
											>
												<Facebook variant='Bold' size={18} className={styles.social_media_icon} />
											</Link>
										</Tippy>
									)}

									{contact?.instagram && (
										<Tippy content='Instagram'>
											<Link
												href={contact.instagram}
												target='_blank'
												rel='noopener noreferrer'
												className={styles.social_media_item}
											>
												<Instagram variant='Bold' size={18} className={styles.social_media_icon} />
											</Link>
										</Tippy>
									)}

									{contact?.email && (
										<Tippy content='Email'>
											<Link href={`mailto:${contact.email}`} className={styles.social_media_item}>
												<Sms variant='Bold' size={18} className={styles.social_media_icon} />
											</Link>
										</Tippy>
									)}

									{contact?.youtube && (
										<Tippy content='Youtube'>
											<Link
												href={contact.youtube}
												target='_blank'
												rel='noopener noreferrer'
												className={styles.social_media_item}
											>
												<Youtube variant='Bold' size={18} className={styles.social_media_icon} />
											</Link>
										</Tippy>
									)}
								</div>
							</div>
						)}
					</div>
				</LayoutGrid>
			</section>
		</footer>
	);
}

export default Footer;
