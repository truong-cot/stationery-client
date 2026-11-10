import {AddCircle, Additem, BoxAdd, Edit, MinusCirlce, Trash} from 'iconsax-react';
import styles from './NodeCategory.module.scss';
import type {PropsNodeCategory} from './interfaces';
import {Fragment, useState} from 'react';
import FlexLayout from '~/components/layout/FlexLayout';
import IconActionTable from '~/components/utils/IconActionTable';
import {updateQueryParams} from '~/funcs/queryParams';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {PATH} from '~/constants/config';

function NodeCategory({level, node}: PropsNodeCategory) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState<boolean>(level < 1 ? true : false);

	return (
		<Fragment>
			<div style={{marginLeft: `${level * 20}px`}} className={styles.node}>
				{node.children.length > 0 && (
					<div className={styles.expanded} onClick={() => setOpen(!open)}>
						{open ? (
							<MinusCirlce size='20' color='#E54040' variant='Bold' />
						) : (
							<AddCircle size='20' color='#17B26A' variant='Bold' />
						)}
					</div>
				)}
				<div className={styles.info}>
					<FlexLayout column gap-4>
						<p className={styles.name}>{node.name}</p>
						{node.description && <p className={styles.note}>{node.description}</p>}
					</FlexLayout>
				</div>
				<FlexLayout row wrap>
					<IconActionTable
						icon={<BoxAdd color='#F79009' size={24} />}
						tooltip='Thêm sản phẩm'
						href={`${PATH.AdminCreateProduct}?_idCategory=${node._id}`}
					/>
					<IconActionTable
						icon={<Additem color='#0EB260' size={24} />}
						tooltip='Thêm danh mục con'
						onClick={() =>
							updateQueryParams(router, pathname, searchParams, {
								set: {
									_action: 'create',
									_idParent: node?._id,
								},
								options: {
									scroll: false,
								},
							})
						}
					/>
					<IconActionTable
						icon={<Edit color='#292D32' size={24} />}
						tooltip='Chỉnh sửa danh mục'
						onClick={() =>
							updateQueryParams(router, pathname, searchParams, {
								set: {
									_idUpdate: node?._id,
								},
								options: {
									scroll: false,
								},
							})
						}
					/>
					<IconActionTable
						icon={<Trash color='#EE0033' size={24} />}
						tooltip='Xóa danh mục'
						onClick={() =>
							updateQueryParams(router, pathname, searchParams, {
								set: {
									_idDelete: node?._id,
								},
								options: {
									scroll: false,
								},
							})
						}
					/>
				</FlexLayout>
			</div>

			{open && (
				<>
					{node?.children?.map((node) => (
						<NodeCategory key={node._id} level={level + 1} node={node} />
					))}
				</>
			)}
		</Fragment>
	);
}

export default NodeCategory;
