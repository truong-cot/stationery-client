import {axiosClient} from '~/libs/axios';

export interface IOrderItemPayload {
	product_id: string;
	quantity: number;
}

export interface ICreateOrderPayload {
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note?: string;
	items: IOrderItemPayload[];
}

export interface IUpdateOrderPayload {
	_id: string;
	customer_name?: string;
	customer_phone?: string;
	shipping_address?: string;
	customer_note?: string;
	items?: IOrderItemPayload[];
}

export interface IPageListOrderPayload {
	page: number;
	pageSize: number;
	keyword?: string;
	order_status?: string;
	from_date?: string;
	to_date?: string;
}

export interface IUpdateStatusOrderPayload {
	_id: string;
	order_status: string;
}

const orderServices = {
	getPageList: (payload: IPageListOrderPayload) => {
		return axiosClient.post(`/order/page-list-order`, payload);
	},
	detail: (payload: {_id: string}) => {
		return axiosClient.get(`/order/detail/${payload._id}`);
	},
	create: (payload: ICreateOrderPayload) => {
		return axiosClient.post(`/order/create`, payload);
	},
	update: (payload: IUpdateOrderPayload) => {
		return axiosClient.post(`/order/update`, payload);
	},
	updateStatus: (payload: IUpdateStatusOrderPayload) => {
		return axiosClient.post(`/order/update-status`, payload);
	},
	delete: (payload: {_id: string}) => {
		return axiosClient.delete(`/order/delete/${payload._id}`);
	},
};

export default orderServices;

