import {Element3, SecurityUser, Colorfilter, Size, TriangleLogo, Category2, Book1, Moneys, SmsEdit} from 'iconsax-reactjs';

export const KEY_STORE = 'stationery-client';

export const COOKIE_KEY = {
	ACCESS_TOKEN: 'access_token',
};

export const PATH = {
	Any: '/any',
	Home: '/',
	Product: '/product',
	About: '/about',

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
	// {
	// 	title: 'Quản lý màu sắc',
	// 	icon: Colorfilter,
	// 	path: PATH.AdminColor,
	// 	pathActive: PATH.AdminColor,
	// },
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
