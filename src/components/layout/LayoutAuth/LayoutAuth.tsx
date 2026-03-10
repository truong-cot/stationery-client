import RequiredLogout from '~/components/protected/RequiredLogout';
import styles from './LayoutAuth.module.scss';
import {PropsLayoutAuth} from './interfaces';
import {formatPhoneVN} from '~/funcs/optionConvert';

function LayoutAuth({children}: PropsLayoutAuth) {
	return (
		<RequiredLogout>
			<div className={styles.container}>
				<div className={styles.background}></div>
				<main className={styles.main}>
					{children}
					<div className={styles.copyright}>
						<p>Bản quyền © 2026 - Đặng Bá Trường - {formatPhoneVN('0339940200')}</p>
					</div>
				</main>
			</div>
		</RequiredLogout>
	);
}

export default LayoutAuth;
