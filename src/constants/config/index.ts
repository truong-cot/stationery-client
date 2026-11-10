import { Book1, Category2, Colorfilter, Moneys, Receipt21, SecurityUser, SmsEdit } from 'iconsax-reactjs';
import { TYPE_DATE } from './enum';

export const KEY_STORE = 'stationery-client';

export const COOKIE_KEY = {
	ACCESS_TOKEN: 'access_token',
};

export const PATH = {
	Any: '/any',
	Home: '/',
	Product: '/product',
	Order: '/order',
	TrackingOrder: '/tracking-order',

	AuthLogin: '/login',

	AdminAccount: '/admin/account',
	AdminColor: '/admin/color',
	AdminSize: '/admin/size',
	AdminTrademark: '/admin/trademark',
	AdminCategory: '/admin/category',
	AdminSetupPrice: '/admin/setup-price',
	AdminProduct: '/admin/product',
	AdminCreateProduct: '/admin/product/create',
	AdminUpdateProduct: '/admin/product/update',

	AdminOrder: '/admin/order',

	AdminContact: '/admin/contact',
};

export interface IMenu {
	title: string;
	path: string;
	icon: any;
}

export const menusAdmin: {
	path: string;
	pathActive: string;
	title: string;
	icon: any;
}[] = [
	{
		title: 'Quản lý tài khoản',
		icon: SecurityUser,
		path: PATH.AdminAccount,
		pathActive: PATH.AdminAccount,
	},
	{
		title: 'Quản lý màu sắc',
		icon: Colorfilter,
		path: PATH.AdminColor,
		pathActive: PATH.AdminColor,
	},
	// {
	// 	title: 'Quản lý kích cỡ',
	// 	icon: Size,
	// 	path: PATH.AdminSize,
	// 	pathActive: PATH.AdminSize,
	// },
	// {
	// 	title: 'Quản lý thương hiệu',
	// 	icon: TriangleLogo,
	// 	path: PATH.AdminTrademark,
	// 	pathActive: PATH.AdminTrademark,
	// },
	{
		title: 'Quản lý danh mục',
		icon: Category2,
		path: PATH.AdminCategory,
		pathActive: PATH.AdminCategory,
	},
	{
		title: 'Quản lý sản phẩm',
		icon: Book1,
		path: PATH.AdminProduct,
		pathActive: PATH.AdminProduct,
	},
	{
		title: 'Quản lý đơn hàng',
		icon: Receipt21,
		path: PATH.AdminOrder,
		pathActive: PATH.AdminOrder,
	},
	{
		title: 'Cấu hình khoảng giá',
		icon: Moneys,
		path: PATH.AdminSetupPrice,
		pathActive: PATH.AdminSetupPrice,
	},
	{
		title: 'Thông tin liên hệ',
		icon: SmsEdit,
		path: PATH.AdminContact,
		pathActive: PATH.AdminContact,
	},
];

export const optionSorts: {
	value: string;
	name: string;
}[] = [
	{
		value: '1',
		name: 'Mới nhất',
	},
	{
		value: '2',
		name: 'Giá thấp đến cao',
	},
	{
		value: '3',
		name: 'Giá cao đến thấp',
	},
];

export const DATE_OPTIONS: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Tất cả',
		value: TYPE_DATE.ALL,
	},
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Hôm qua',
		value: TYPE_DATE.YESTERDAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: '7 ngày trước',
		value: TYPE_DATE.LAST_7_DAYS,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	{
		name: 'Tháng trước',
		value: TYPE_DATE.LAST_MONTH,
	},
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];
