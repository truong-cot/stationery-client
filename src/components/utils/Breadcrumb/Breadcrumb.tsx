import React from 'react';

import {PropsBreadcrumb} from './interfaces';
import styles from './Breadcrumb.module.scss';
import Link from 'next/link';
import {IoIosArrowForward} from 'react-icons/io';
import clsx from 'clsx';

import {DocumentText1} from 'iconsax-react';

function Breadcrumb({listUrls, isPadding = true, actions}: PropsBreadcrumb) {
	return (
		<div className={clsx(styles.main, {[styles.isPadding]: isPadding})}>
			<div className={styles.breadcrumb}>
				<div className={styles.icon}>
					<DocumentText1 size={20} color='#141416' />
				</div>

				{listUrls?.map((v, i) => (
					<div key={i} className={styles.item}>
						<Link
							href={v.path}
							className={clsx(styles.link, {[styles.pathNow]: i == listUrls.length - 1})}
							onClick={(e) => (!v.path || i == listUrls.length - 1) && e.preventDefault()}
						>
							{v.title}
						</Link>
						{i != listUrls.length - 1 && <IoIosArrowForward color='#141416' />}
					</div>
				))}
			</div>
			{actions}
		</div>
	);
}

export default Breadcrumb;
