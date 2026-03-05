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

function Footer({}: PropsFooter) {
	return (
		<footer>
			<section className={styles.section}>
				<LayoutGrid>
					<Link href={PATH.Home}>
						<Image alt='Logo' src={icons.logo} width={160} style={{margin: '0 auto', marginBottom: '12px'}} />
					</Link>
					<h4 className={styles.title}>Website thương mại điện tử Văn phòng phẩm</h4>
				</LayoutGrid>
			</section>
			<section className={styles.section}>
				<LayoutGrid>
					<div className={styles.copyright}>
						<div className={styles.text}>
							<p>Điện thoại: 033.994.0200</p>
							<p>Email: email.gmail.com</p>
							<p>Hotline: 033.994.0200 (08h00-17h00: T2-T6)</p>
							<p>Đ/c: Tầng 3, số 105 Láng Hạ, phường Đống Đa, TP Hà Nội, Việt Nam.</p>
						</div>
						<div className={styles.right}>
							<div className={styles.social_media}>
								<Tippy content='Facebook'>
									<div className={styles.social_media_item}>
										<Facebook variant='Bold' size={20} className={styles.social_media_icon} />
									</div>
								</Tippy>
								<Tippy content='Instagram'>
									<div className={styles.social_media_item}>
										<Instagram variant='Bold' size={20} className={styles.social_media_icon} />
									</div>
								</Tippy>
								<Tippy content='Telegram'>
									<div className={styles.social_media_item}>
										<FaTelegram size={20} className={styles.social_media_icon} />
									</div>
								</Tippy>
								<Tippy content='Email'>
									<div className={styles.social_media_item}>
										<Sms variant='Bold' size={20} className={styles.social_media_icon} />
									</div>
								</Tippy>
								<Tippy content='Youtube'>
									<div className={styles.social_media_item}>
										<Youtube variant='Bold' size={20} className={styles.social_media_icon} />
									</div>
								</Tippy>
							</div>
							<Link href={PATH.About} className={styles.about}>
								Về chúng tôi
							</Link>
						</div>
					</div>
				</LayoutGrid>
			</section>
		</footer>
	);
}

export default Footer;
