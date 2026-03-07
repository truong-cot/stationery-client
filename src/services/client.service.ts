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
	productFeatured: () => {
		return axiosClient.get(`/client/product-featured`);
	},
	productNew: () => {
		return axiosClient.get(`/client/product-new`);
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
	pageListProduct: (payload: {
		page: number;
		pageSize: number;
		keyword: string;
		category_id: string;
		color_id: string;
		size_id: string;
		trademark_id: string;
		setup_price_id: string;
		sort: string;
	}) => {
		return axiosClient.post(`/client/page-list-product`, payload);
	},
};

export default clientServices;
