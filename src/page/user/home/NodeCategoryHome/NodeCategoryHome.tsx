import {Fragment, useState} from 'react';
import styles from './NodeCategoryHome.module.scss';
import type {PropsNodeCategoryHome} from './interfaces';
import clsx from 'clsx';
import {ArrowDown2, ArrowRight2} from 'iconsax-react';
import Link from 'next/link';
import {PATH} from '~/constants/config';

function NodeCategoryHome({node, level}: PropsNodeCategoryHome) {
	const [open, setOpen] = useState<boolean>(level <= 0);

	return (
		<Fragment>
			<div
				style={{marginLeft: `${level * 16}px`}}
				className={clsx(styles.node_category, {
					[styles.active]: false,
				})}
			>
				{node.children.length > 0 ? (
					<div className={styles.expanded} onClick={() => setOpen(!open)}>
						{open ? (
							<ArrowDown2 size='28' color='#697586' variant='Bold' />
						) : (
							<ArrowRight2 size='28' color='#697586' variant='Bold' />
						)}
					</div>
				) : (
					<div
						style={{
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							background: '#697586',
						}}
					/>
				)}
				<Link href={`${PATH.Product}?_categoryId=${node._id}`} className={styles.node_name}>
					{node.name}
				</Link>
			</div>

			{open && node.children?.map((child) => <NodeCategoryHome key={child._id} level={level + 1} node={child} />)}
		</Fragment>
	);
}

export default NodeCategoryHome;
