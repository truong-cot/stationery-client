import {Element3, SecurityUser, Colorfilter, Size, TriangleLogo, Category2, Book1, Moneys} from 'iconsax-reactjs';

export const KEY_STORE = 'stationery-client';

export const COOKIE_KEY = {
	ACCESS_TOKEN: 'access_token',
};

export const PATH = {
	Any: '/any',
	Home: '/',

	AuthLogin: '/login',

	AdminDashboard: '/admin/dashboard',
	AdminAccount: '/admin/account',
	AdminColor: '/admin/color',
	AdminSize: '/admin/size',
	AdminTrademark: '/admin/trademark',
	AdminCategory: '/admin/category',
	AdminSetupPrice: '/admin/setup-price',
	AdminProduct: '/admin/product',
	AdminCreateProduct: '/admin/product/create',
	AdminUpdateProduct: '/admin/product/update',
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
		title: 'Tổng quan',
		icon: Element3,
		path: PATH.AdminDashboard,
		pathActive: PATH.AdminDashboard,
	},
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
	{
		title: 'Quản lý kích cỡ',
		icon: Size,
		path: PATH.AdminSize,
		pathActive: PATH.AdminSize,
	},
	{
		title: 'Quản lý thương hiệu',
		icon: TriangleLogo,
		path: PATH.AdminTrademark,
		pathActive: PATH.AdminTrademark,
	},
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
		title: 'Cấu hình khoảng giá',
		icon: Moneys,
		path: PATH.AdminSetupPrice,
		pathActive: PATH.AdminSetupPrice,
	},
];
