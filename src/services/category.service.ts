import {axiosClient} from '~/libs/axios';

const categoryServices = {
	create: (payload: {
		name: string;
		description: string;
		parent_id: string;
		color_ids: string[];
		size_ids: string[];
		trademark_ids: string[];
	}) => {
		return axiosClient.post(`/category/create`, payload);
	},
	update: (payload: {
		_id: string;
		name: string;
		description: string;
		parent_id: string;
		color_ids: string[];
		size_ids: string[];
		trademark_ids: string[];
	}) => {
		return axiosClient.post(`/category/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string; color_id: string; size_id: string; trademark_id: string}) => {
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
	getPageListTree: (payload: {
		page: number;
		pageSize: number;
		keyword: string;
		color_id: string;
		size_id: string;
		trademark_id: string;
	}) => {
		return axiosClient.post(`/category/page-list-tree-category`, payload);
	},
};

export default categoryServices;
