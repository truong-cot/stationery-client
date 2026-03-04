import {axiosClient} from '~/libs/axios';

const accountServices = {
	create: (payload: {name: string; username: string; password: string; description: string}) => {
		return axiosClient.post(`/account/create`, payload);
	},
	update: (payload: {_id: string; name: string; description: string}) => {
		return axiosClient.post(`/account/update`, payload);
	},
	getPageList: (payload: {page: number; pageSize: number; keyword: string}) => {
		return axiosClient.post(`/account/page-list-account`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/account/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/account/detail/${payload._id}`);
	},
	resetPassword: (payload: {_id: string; newPassword: string}) => {
		return axiosClient.post(`/account/reset-password`, payload);
	},
};

export default accountServices;
