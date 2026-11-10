import {IOrderDetail} from '../../DetailOrder/interfaces';

export interface PropsInvoicePDF {
	order?: IOrderDetail;
	orders?: IOrderDetail[];
	storeInfo?: {
		name?: string;
		slogan?: string;
		address?: string;
		phones?: string;
	};
}
