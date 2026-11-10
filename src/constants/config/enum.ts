export const QUERY_KEY = {
	getProfile: 'get-profile',
	getContact: 'get-contact',

	pageListAccount: 'page-list-account',
	detailAccount: 'detail-account',

	pageListColor: 'page-list-color',
	detailColor: 'detail-color',
	catalogColor: 'catalog-color',

	pageListSize: 'page-list-size',
	detailSize: 'detail-size',
	catalogSize: 'catalog-size',

	pageListTrademark: 'page-list-trademark',
	detailTrademark: 'detail-trademark',
	catalogTrademark: 'catalog-trademark',

	pageListCategory: 'page-list-category',
	detailCategory: 'detail-category',
	catalogCategory: 'catalog-category',
	treeCategoryFull: 'tree-category-full',

	pageListSetupPrice: 'page-list-setup-price',
	detailSetupPrice: 'detail-setup-price',

	pageListProduct: 'page-list-product',
	detailProduct: 'detail-product',

	pageListOrder: 'page-list-order',
	detailOrder: 'detail-order',

	detailContact: 'detail-contact',

	clientCatalogCategory: 'client-catalog-category',
	clientCatalogColor: 'client-catalog-color',
	clientCatalogSize: 'client-catalog-size',
	clientCatalogTrademark: 'client-catalog-trademark',
	clientCatalogSetupPrice: 'client-catalog-price',
	clientSearchProduct: 'client-search-product',
	clientTreeCategory: 'client-tree-category',
	clientProductFeatured: 'client-product-featured',
	clientProductSimilar: 'client-product-similar',
	clientProductNew: 'client-product-new',
	clientPageListProduct: 'client-page-list-product',
	clientCatalogCategoryParent: 'client-catalog-category-parent',
	clientDirectSubCategory: 'client-direct-sub-category',
};

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LAST_7_DAYS = 8,
	LUA_CHON = 9,
}
