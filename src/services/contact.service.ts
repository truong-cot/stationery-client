import {axiosClient} from '~/libs/axios';

const contactServices = {
	update: (payload: {
		phone: string;
		email: string;
		address: string;
		facebook: string;
		zalo: string;
		instagram: string;
		youtube: string;
	}) => {
		return axiosClient.post(`/contact/update`, payload);
	},
	detail: () => {
		return axiosClient.get(`/contact/detail`);
	},
};

export default contactServices;
