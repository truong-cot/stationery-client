import {IoClose} from 'react-icons/io5';
import styles from './TagRefItem.module.scss';
import type {PropsTagRefItem} from './interfaces';

function TagRefItem({color = '#292D32', name, onClean}: PropsTagRefItem) {
	return (
		<div className={styles.tag_ref_item}>
			<div style={{width: '6px', height: '6px', borderRadius: '50%', background: color}}></div>
			<p>{name}</p>
			{onClean && (
				<div className={styles.clean} onClick={onClean}>
					<IoClose size={14} />
				</div>
			)}
		</div>
	);
}

export default TagRefItem;
