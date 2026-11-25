import {cache} from 'react';
import {ApiResponse} from '~/funcs/api-response';
import {RESPONSE_CODE} from '~/funcs/httpRequest';
import {axiosClient} from '~/libs/axios';
import {IProductDetail} from '~/page/user/product/MainDetailProduct/interfaces';

export interface IClientCreateOrderPayload {
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note?: string;
	items: {
		product_id: string;
		classify_id?: string | null;
		quantity: number;
	}[];
}

export interface IClientOrderItemResponse {
	product_id: string;
	product_name: string;
	product_image: string;
	pack_size?: string;
	classify_id?: string | null;
	classify_name?: string | null;
	price: number;
	quantity: number;
	subtotal: number;
}

export interface IClientOrderResponse {
	_id: string;
	code: string;
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note?: string;
	items: IClientOrderItemResponse[];
	total_amount: number;
	order_status: string;
	created_at: string;
}

export interface IClientTrackingOrderPayload {
	phone?: string;
	code?: string;
	page?: number;
	pageSize?: number;
}

export interface IClientTrackingOrderResponse {
	items: IClientOrderResponse[];
	pagination: {
		currentPage: number;
		totalCount: number;
	};
}

const clientServices = {
	searchProduct: (payload: {keyword: string; category_id: string}) => {
		return axiosClient.post(`/client/search-product`, payload);
	},
	catalogCategory: () => {
		return axiosClient.get(`/client/catalog-category`);
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
	catalogSize: (payload?: {category_id?: string}) => {
		return axiosClient.post(`/client/catalog-size`, payload || {});
	},
	pageListProduct: (payload: {
		page: number;
		pageSize: number;
		keyword: string;
		category_id: string;
		size_id?: string;
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
	createOrder: (payload: IClientCreateOrderPayload) => {
		return axiosClient.post(`/client/create-order`, payload);
	},
	trackingOrder: (payload: IClientTrackingOrderPayload) => {
		return axiosClient.post(`/client/tracking-order`, payload);
	},
};

export default clientServices;

export const getProductDetail = cache(async (_id: string): Promise<IProductDetail | null> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/detail-product/${_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!res.ok) {
			return null;
		}

		const data: ApiResponse<IProductDetail> = await res.json();

		if (data.code != RESPONSE_CODE.SUCCESS || !data.data) {
			return null;
		}

		return data.data;
	} catch (error) {
		return null;
	}
});
