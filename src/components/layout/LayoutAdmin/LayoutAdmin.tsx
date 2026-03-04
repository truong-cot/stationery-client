'use client';

import RequireAuth from '~/components/protected/RequiredAuth';
import styles from './LayoutAdmin.module.scss';
import Navbar from './components/Navbar';
import {PropsLayoutAdmin} from './interfaces';

function LayoutAdmin({children}: PropsLayoutAdmin) {
	return (
		<RequireAuth>
			<div className={styles.container}>
				<Navbar />
				<main>{children}</main>
			</div>
		</RequireAuth>
	);
}

export default LayoutAdmin;
