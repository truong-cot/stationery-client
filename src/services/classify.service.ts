import {axiosClient} from '~/libs/axios';

const classifyServices = {
	create: (payload: {name: string; description?: string}) => {
		return axiosClient.post(`/classify/create`, payload);
	},
	update: (payload: {_id: string; name: string; description?: string}) => {
		return axiosClient.post(`/classify/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword?: string}) => {
		return axiosClient.post(`/classify/page-list-classify`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/classify/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/classify/detail/${payload._id}`);
	},
	catalog: (payload?: {keyword?: string}) => {
		return axiosClient.post(`/classify/catalog-classify`, payload || {});
	},
};

export default classifyServices;
