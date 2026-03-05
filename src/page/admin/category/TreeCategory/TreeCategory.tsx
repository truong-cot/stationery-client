import {useQuery} from '@tanstack/react-query';
import styles from './TreeCategory.module.scss';
import type {INodeCategory, PropsTreeCategory} from './interfaces';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import MainTable from '~/components/utils/MainTable';
import DataWrapper from '~/components/utils/DataWrapper';
import NodeCategory from '../NodeCategory';

function TreeCategory({}: PropsTreeCategory) {
	const {data: roots = [], isLoading} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.treeCategoryFull],
		queryFn: () =>
			httpRequest({
				http: categoryServices.treeCategoryFull(),
			}),
	});

	return (
		<MainTable>
			<DataWrapper data={roots} loading={isLoading} title='Dữ liệu trống!' note='Cây danh mục hiện đang trống!'>
				{roots?.map((node) => (
					<NodeCategory key={node._id} level={0} node={node} />
				))}
			</DataWrapper>
		</MainTable>
	);
}

export default TreeCategory;
