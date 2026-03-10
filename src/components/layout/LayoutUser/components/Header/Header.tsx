'use client';

import {Call, LockSlash} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import LayoutGrid from '~/components/layout/LayoutGrid';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import SearchProduct from '../SearchProduct';
import styles from './Header.module.scss';
import type {PropsHeader} from './interfaces';
import {useSelector} from 'react-redux';
import {RootState} from '~/store';
import {formatPhoneVN} from '~/funcs/optionConvert';

function Header({}: PropsHeader) {
	const {contact} = useSelector((state: RootState) => state.user);

	return (
		<div className={styles.wrapper_header}>
			<LayoutGrid>
				<div className={styles.main_header}>
					<Link href={PATH.Home}>
						<Image alt='Logo' src={icons.logo} width={180} />
					</Link>
					<div className={styles.search}>
						<SearchProduct />
					</div>
					<div className={styles.phone}>
						<div className={styles.icon}>
							<Call size='20' color='#fff' variant='Bold' />
						</div>
						<div className={styles.info}>
							<p>Điện thoại</p>
							<p>{formatPhoneVN(contact?.phone) || 'Đang cập nhật!'}</p>
						</div>
					</div>
					<Link href={PATH.AuthLogin} className={styles.admin}>
						<LockSlash size='20' color='#fff' variant='Bold' />
						<p>Quản trị viên</p>
					</Link>
				</div>
			</LayoutGrid>
		</div>
	);
}

export default Header;
