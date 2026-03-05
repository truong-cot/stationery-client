import {axiosClient} from '~/libs/axios';

const authServices = {
	login: (payload: {username: string; password: string}) => {
		return axiosClient.post(`/auth/login`, payload);
	},
	getProfile: () => {
		return axiosClient.get(`/auth/get-profile`);
	},
	changeMyPassword: (payload: {oldPassword: string; newPassword: string}) => {
		return axiosClient.post(`/auth/change-my-password`, payload);
	},
	updateInfoProfile: (payload: {name: string; description: string}) => {
		return axiosClient.post(`/auth/update-info-profile`, payload);
	},
};

export default authServices;
