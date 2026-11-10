import {axiosClient} from '~/libs/axios';

const colorServices = {
	create: (payload: {name: string; code: string; description: string}) => {
		return axiosClient.post(`/color/create`, payload);
	},
	update: (payload: {_id: string; name: string; code: string; description: string}) => {
		return axiosClient.post(`/color/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string}) => {
		return axiosClient.post(`/color/page-list-color`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/color/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/color/detail/${payload._id}`);
	},
	catalog: (payload?: {category_id?: string}) => {
		return axiosClient.post(`/color/catalog-color`, payload || {});
	},
};

export default colorServices;
