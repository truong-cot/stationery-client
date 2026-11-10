import styles from './LayoutUser.module.scss';
import Footer from './components/Footer';
import Header from './components/Header';
import type {PropsLayoutUser} from './interfaces';

function LayoutUser({children}: PropsLayoutUser) {
	return (
		<div>
			<header className={styles.header}>
				<Header />
			</header>
			<main className={styles.main}>{children}</main>
			<Footer />
		</div>
	);
}

export default LayoutUser;
