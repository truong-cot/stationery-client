import {axiosClient} from '~/libs/axios';

const clientServices = {
	searchProduct: (payload: {keyword: string; category_id: string}) => {
		return axiosClient.post(`/client/search-product`, payload);
	},
	catalogCategory: () => {
		return axiosClient.get(`/client/catalog-category`);
	},
	catalogSetupPrice: () => {
		return axiosClient.get(`/client/catalog-setup-price`);
	},
	treeCategory: () => {
		return axiosClient.get(`/client/tree-category`);
	},
	catalogColor: (payload: {category_id: string}) => {
		return axiosClient.post(`/client/catalog-color`, payload);
	},
	catalogSize: (payload: {category_id: string}) => {
		return axiosClient.post(`/client/catalog-size`, payload);
	},
	catalogTrademark: (payload: {category_id: string}) => {
		return axiosClient.post(`/client/catalog-trademark`, payload);
	},
};

export default clientServices;
