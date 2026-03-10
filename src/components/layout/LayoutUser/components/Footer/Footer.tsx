'use client';

import Tippy from '@tippyjs/react';
import {Facebook, Instagram, Sms, Youtube} from 'iconsax-reactjs';
import {FaTelegram} from 'react-icons/fa';
import LayoutGrid from '~/components/layout/LayoutGrid';
import styles from './Footer.module.scss';
import {PropsFooter} from './interfaces';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useSelector} from 'react-redux';
import {RootState} from '~/store';
import {formatPhoneVN} from '~/funcs/optionConvert';

function Footer({}: PropsFooter) {
	const {contact} = useSelector((state: RootState) => state.user);

	return (
		<footer>
			<section className={styles.section}>
				<LayoutGrid>
					<Link href={PATH.Home}>
						<Image alt='Logo' src={icons.logo} width={200} style={{margin: '0 auto', marginBottom: '12px'}} />
					</Link>
					<h4 className={styles.title}>Website thương mại điện tử Văn phòng phẩm Huyền Anh</h4>
				</LayoutGrid>
			</section>
			<section className={styles.section}>
				<LayoutGrid>
					<div className={styles.copyright}>
						<div className={styles.text}>
							<p>Điện thoại: {formatPhoneVN(contact?.phone) || 'Đang cập nhật!'}</p>
							<p>Hotline: {formatPhoneVN(contact?.phone) || 'Đang cập nhật!'} (T2-CN)</p>
							<p>Email: {contact?.email || 'Đang cập nhật!'}</p>
							<p>Địa chỉ: {contact?.address || 'Đang cập nhật!'}</p>
						</div>
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
											<Facebook variant='Bold' size={20} className={styles.social_media_icon} />
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
											<Instagram variant='Bold' size={20} className={styles.social_media_icon} />
										</Link>
									</Tippy>
								)}

								{contact?.email && (
									<Tippy content='Email'>
										<Link href={`mailto:${contact.email}`} className={styles.social_media_item}>
											<Sms variant='Bold' size={20} className={styles.social_media_icon} />
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
											<Youtube variant='Bold' size={20} className={styles.social_media_icon} />
										</Link>
									</Tippy>
								)}
							</div>
						</div>
					</div>
				</LayoutGrid>
			</section>
		</footer>
	);
}

export default Footer;
