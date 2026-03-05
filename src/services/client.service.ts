import {axiosClient} from '~/libs/axios';

const clientServices = {
	searchProduct: (payload: {keyword: string; category_id: string}) => {
		return axiosClient.post(`/client/search-product`, payload);
	},
	catalogCategory: () => {
		return axiosClient.get(`/client/catalog-category`);
	},
};

export default clientServices;
