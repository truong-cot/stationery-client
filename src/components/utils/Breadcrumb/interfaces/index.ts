export interface PropsBreadcrumb {
	listUrls: {
		title: string;
		path: string;
	}[];
	isPadding?: boolean;
	actions?: React.ReactNode;
}
