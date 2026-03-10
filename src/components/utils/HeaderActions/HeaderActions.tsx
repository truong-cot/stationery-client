'use client';

import Image from 'next/image';
import styles from './HeaderActions.module.scss';
import {PropsHeaderActions} from './interfaces';
import icons from '~/constants/images/icons';
import clsx from 'clsx';
import {useState} from 'react';
import Navbar from '~/components/layout/LayoutAdmin/components/Navbar';

function HeaderActions({title, actions}: PropsHeaderActions) {
	const [openNavbarMobile, setOpenNavbarMobile] = useState<boolean>(false);

	return (
		<header className={styles.header}>
			<div className={styles.action}>
				<div className={styles.menu_line} onClick={() => setOpenNavbarMobile(true)}>
					<Image alt='Menu line' src={icons.menuLine} width={24} height={24} />
				</div>
				<h4>{title}</h4>
			</div>
			{actions && actions}

			<div className={clsx(styles.navbar_mobile, {[styles.open]: openNavbarMobile})}>
				<Navbar onClose={() => setOpenNavbarMobile(false)} />
			</div>
		</header>
	);
}

export default HeaderActions;
