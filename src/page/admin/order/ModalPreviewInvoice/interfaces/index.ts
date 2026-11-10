export interface PropsModalPreviewInvoice {
	open: boolean;
	onClose: () => void;
	blobUrl: string | null;
	title?: string;
	fileName?: string;
	loading?: boolean;
}

