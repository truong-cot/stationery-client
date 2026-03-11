import {cache} from 'react';
import {ApiResponse} from '~/funcs/api-response';
import {RESPONSE_CODE} from '~/funcs/httpRequest';
import {axiosClient} from '~/libs/axios';
import {IProductDetail} from '~/page/user/product/MainDetailProduct/interfaces';

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
	productSimilar: (payload: {product_id: string}) => {
		return axiosClient.post(`/client/product-similar`, payload);
	},
	catalogCategoryParent: () => {
		return axiosClient.get(`/client/catalog-category-parent`);
	},
	getContact: () => {
		return axiosClient.get(`/client/contact`);
	},
	directSubCategory: (payload: {category_id: string}) => {
		return axiosClient.post(`/client/direct-sub-category`, payload);
	},
};

export default clientServices;

export const getProductDetail = cache(async (_id: string): Promise<IProductDetail> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/detail-product/${_id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	});

	if (!res.ok) {
		throw new Error('Gọi api thất bại!');
	}

	const data: ApiResponse<IProductDetail> = await res.json();

	if (data.code != RESPONSE_CODE.SUCCESS) {
		throw new Error(data.message || 'Gọi api thất bại!');
	}

	return data.data;
});
