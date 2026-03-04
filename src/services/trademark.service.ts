import {axiosClient} from '~/libs/axios';

const trademarkServices = {
	create: (payload: {name: string; description: string}) => {
		return axiosClient.post(`/trademark/create`, payload);
	},
	update: (payload: {_id: string; name: string; description: string}) => {
		return axiosClient.post(`/trademark/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string; category_id: string}) => {
		return axiosClient.post(`/trademark/page-list-trademark`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/trademark/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/trademark/detail/${payload._id}`);
	},
	catalog: (payload: {category_id: string}) => {
		return axiosClient.post(`/trademark/catalog-trademark`, payload);
	},
};

export default trademarkServices;
