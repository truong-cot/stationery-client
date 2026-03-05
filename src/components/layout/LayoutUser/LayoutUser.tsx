import styles from './LayoutUser.module.scss';
import Footer from './components/Footer';
import Header from './components/Header';
import type {PropsLayoutUser} from './interfaces';

function LayoutUser({children}: PropsLayoutUser) {
	return (
		<main>
			<header className={styles.header}>
				<Header />
			</header>
			<div className={styles.main}>{children}</div>
			<Footer />
		</main>
	);
}

export default LayoutUser;
