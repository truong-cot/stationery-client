import {axiosClient} from '~/libs/axios';

const sizeServices = {
	create: (payload: {name: string; description: string}) => {
		return axiosClient.post(`/size/create`, payload);
	},
	update: (payload: {_id: string; name: string; description: string}) => {
		return axiosClient.post(`/size/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string; category_id: string}) => {
		return axiosClient.post(`/size/page-list-size`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/size/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/size/detail/${payload._id}`);
	},
	catalog: (payload: {category_id: string}) => {
		return axiosClient.post(`/size/catalog-size`, payload);
	},
};

export default sizeServices;
