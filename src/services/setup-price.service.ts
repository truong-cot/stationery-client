import {axiosClient} from '~/libs/axios';

const setupPriceServices = {
	create: (payload: {min: number; max: number; description: string}) => {
		return axiosClient.post(`/setup-price/create`, payload);
	},
	update: (payload: {_id: string; min: number; max: number; description: string}) => {
		return axiosClient.post(`/setup-price/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string}) => {
		return axiosClient.post(`/setup-price/page-list-setup-price`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/setup-price/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/setup-price/detail/${payload._id}`);
	},
};

export default setupPriceServices;
