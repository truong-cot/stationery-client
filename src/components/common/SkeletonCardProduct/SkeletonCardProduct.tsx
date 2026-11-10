import React from 'react';
import styles from './SkeletonCardProduct.module.scss';

interface PropsSkeletonCardProduct {
	count?: number;
}

export function SkeletonCardProductItem() {
	return (
		<div className={styles.skeleton_card}>
			<div className={styles.image_box}>
				<div className={styles.shimmer}></div>
			</div>
			<div className={styles.info}>
				<div className={styles.line_title}>
					<div className={styles.shimmer}></div>
				</div>
				<div className={styles.line_title_sub}>
					<div className={styles.shimmer}></div>
				</div>
				<div className={styles.line_pack}>
					<div className={styles.shimmer}></div>
				</div>
				<div className={styles.line_price}>
					<div className={styles.shimmer}></div>
				</div>
				<div className={styles.action_row}>
					<div className={styles.btn_action}>
						<div className={styles.shimmer}></div>
					</div>
					<div className={styles.stepper}>
						<div className={styles.shimmer}></div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SkeletonCardProduct({count = 4}: PropsSkeletonCardProduct) {
	return (
		<>
			{Array.from({length: count}).map((_, i) => (
				<SkeletonCardProductItem key={i} />
			))}
		</>
	);
}

export default SkeletonCardProduct;

