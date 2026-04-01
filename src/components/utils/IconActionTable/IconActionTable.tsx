import React from 'react';

import {PropsIconActionTable} from './interfaces';
import styles from './IconActionTable.module.scss';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Link from 'next/link';

function IconActionTable({icon, tooltip, onClick, href, disnable = false, background = 'transparent'}: PropsIconActionTable) {
	return (
		<Tippy content={tooltip}>
			{href ? (
				<Link href={href} style={{background: background}} className={clsx({[styles.disnable]: disnable}, styles.container)}>
					<div className={styles.icon}>{icon}</div>
				</Link>
			) : (
				<div style={{background: background}} className={clsx({[styles.disnable]: disnable}, styles.container)} onClick={onClick}>
					<div className={styles.icon}>{icon}</div>
				</div>
			)}
		</Tippy>
	);
}

export default IconActionTable;
