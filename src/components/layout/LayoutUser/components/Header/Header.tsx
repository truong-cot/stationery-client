import {Call, LockSlash} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import LayoutGrid from '~/components/layout/LayoutGrid';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import SearchProduct from '../SearchProduct';
import styles from './Header.module.scss';
import type {PropsHeader} from './interfaces';
import {IoSearch} from 'react-icons/io5';

function Header({}: PropsHeader) {
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
					<Link href={PATH.Product} className={styles.icon_search}>
						<IoSearch size={20} color='#202939' />
					</Link>
					<div className={styles.phone}>
						<div className={styles.icon}>
							<Call size='20' color='#fff' variant='Bold' />
						</div>
						<div className={styles.info}>
							<p>Điện thoại</p>
							<p>033.492.8394</p>
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
