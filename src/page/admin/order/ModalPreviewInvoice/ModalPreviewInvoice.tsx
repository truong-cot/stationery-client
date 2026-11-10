'use client';

import React from 'react';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import type {PropsModalPreviewInvoice} from './interfaces';
import styles from './ModalPreviewInvoice.module.scss';

function ModalPreviewInvoice({
	open,
	onClose,
	blobUrl,
	title = 'Phiếu xuất hàng',
	fileName = 'Hoa-don.pdf',
	loading = false,
}: PropsModalPreviewInvoice) {
	const handleDownload = () => {
		if (!blobUrl) return;
		const a = document.createElement('a');
		a.href = blobUrl;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<Popup open={open} onClose={onClose}>
			<div className={styles.container}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.titleWrapper}>
						<h3>{title}</h3>
						<span className={styles.badge}>Bản xem trước PDF</span>
					</div>

					<div className={styles.actions}>
						{blobUrl && (
							<div>
								<Button p_8_24 rounded_8 white bold onClick={handleDownload}>
									Tải xuống
								</Button>
							</div>
						)}
						<div className={styles.closeBtn} onClick={onClose} title='Đóng xem trước'>
							<IoClose size={22} />
						</div>
					</div>
				</div>

				{/* Body iframe preview */}
				<div className={styles.body}>
					{loading || !blobUrl ? (
						<div className={styles.loadingWrapper}>
							<Loading loading={true} />
							<span>Đang tạo bản xem trước hóa đơn...</span>
						</div>
					) : (
						<iframe
							src={`${blobUrl}#toolbar=1`}
							title='Xem trước hóa đơn'
						/>
					)}
				</div>
			</div>
		</Popup>
	);
}

export default ModalPreviewInvoice;

