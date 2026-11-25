import {axiosClient} from '~/libs/axios';

const productServices = {
	create: (payload: {
		name: string;
		price: number;
		pack_size: string;
		images: string[];
		short_description?: string;
		category_id: string;
		classify_ids: string[];
		color_ids?: string[];
		size_id?: string;
		trademark_id?: string;
		is_featured: boolean;
		status?: number;
	}) => {
		return axiosClient.post(`/product/create`, payload);
	},
	update: (payload: {
		_id: string;
		name: string;
		price: number;
		pack_size: string;
		images: string[];
		short_description?: string;
		category_id: string;
		classify_ids: string[];
		color_ids?: string[];
		size_id?: string;
		trademark_id?: string;
		is_featured: boolean;
		status?: number;
	}) => {
		return axiosClient.post(`/product/update`, payload);
	},
	getPageList: (payload: {
		page: number;
		pageSize: number;
		keyword: string;
		category_id?: string;
		classify_id?: string;
		color_id?: string;
		size_id?: string;
		trademark_id?: string;
		status?: number | null;
	}) => {
		return axiosClient.post(`/product/page-list-product`, payload);
	},
	updateStatus: (payload: {
		_id: string;
		status: number;
	}) => {
		return axiosClient.post(`/product/update-status`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/product/delete/${payload._id}`);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/product/detail/${payload._id}`);
	},
	catalogProduct: () => {
		return axiosClient.get(`/product/catalog-product`);
	},
};

export default productServices;
