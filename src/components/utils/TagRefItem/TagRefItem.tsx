import styles from './TagRefItem.module.scss';
import type {PropsTagRefItem} from './interfaces';

function TagRefItem({color = '#292D32', name}: PropsTagRefItem) {
	return (
		<div className={styles.tag_ref_item}>
			<div style={{width: '6px', height: '6px', borderRadius: '50%', background: color}}></div>
			<p>{name}</p>
		</div>
	);
}

export default TagRefItem;
