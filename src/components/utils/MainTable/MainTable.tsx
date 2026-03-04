import React from 'react';

import {PropsMainTable} from './interfaces';
import styles from './MainTable.module.scss';

function MainTable({children}: PropsMainTable) {
	return <div className={styles.main_table}>{children}</div>;
}

export default MainTable;
