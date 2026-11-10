import {axiosClient} from '~/libs/axios';

const categoryServices = {
	create: (payload: {
		name: string;
		description: string;
		parent_id?: string;
		image?: string | null;
	}) => {
		return axiosClient.post(`/category/create`, payload);
	},
	update: (payload: {
		_id: string;
		name: string;
		description: string;
		parent_id?: string;
		image?: string | null;
	}) => {
		return axiosClient.post(`/category/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string}) => {
		return axiosClient.post(`/category/page-list-category`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/category/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/category/detail/${payload._id}`);
	},
	catalog: () => {
		return axiosClient.get(`/category/catalog-category`);
	},
	treeCategoryFull: () => {
		return axiosClient.get(`/category/tree-category-full`);
	},
};

export default categoryServices;
