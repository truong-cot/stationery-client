import {Document, Font, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import moment from 'moment';
import {convertCoin} from '~/funcs/convertCoin';
import type {PropsInvoicePDF} from './interfaces';

Font.register({
	family: 'Times New Roman',
	fonts: [
		{src: '/fonts/TimesNewRoman-Regular.ttf'},
		{src: '/fonts/TimesNewRoman-Bold.ttf', fontWeight: 'bold'},
		{src: '/fonts/TimesNewRoman-Italic.ttf', fontStyle: 'italic'},
		{src: '/fonts/TimesNewRoman-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic'},
	],
});

const styles = StyleSheet.create({
	page: {
		fontFamily: 'Times New Roman',
		paddingTop: 24,
		paddingBottom: 28,
		paddingHorizontal: 28,
		fontSize: 10,
		color: '#000000',
		lineHeight: 1.3,
	},

	// Header
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},

	storeInfo: {
		width: '68%',
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
	},

	storeName: {
		fontSize: 12,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		color: '#000000',
		marginBottom: 1,
	},

	storeSub: {
		fontSize: 9,
		color: '#000000',
	},

	orderBadgeContainer: {
		width: '32%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		gap: 2,
	},

	orderCodeValue: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000000',
	},

	// Title
	titleContainer: {
		marginTop: 6,
		marginBottom: 8,
		textAlign: 'center',
	},

	mainTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		textAlign: 'center',
		letterSpacing: 0.5,
		color: '#000000',
	},

	subTitleDate: {
		fontSize: 9.5,
		marginTop: 2,
		textAlign: 'center',
		fontStyle: 'italic',
		color: '#000000',
	},

	// Customer Info (Không border, không background, chữ màu đen, có dòng Ghi chú)
	customerSection: {
		marginTop: 6,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'column',
		gap: 4,
	},

	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	infoColLeft: {
		flexDirection: 'row',
		width: '58%',
		alignItems: 'center',
	},

	infoColRight: {
		flexDirection: 'row',
		width: '42%',
		alignItems: 'center',
	},

	infoLabel: {
		fontWeight: 'bold',
		marginRight: 4,
		fontSize: 10,
		color: '#000000',
	},

	infoValue: {
		fontSize: 10,
		color: '#000000',
	},

	// Table liền nhau hoàn toàn (không gap, không đứt đoạn viền dọc)
	table: {
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderColor: '#000000',
	},

	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#000000',
		minHeight: 22,
	},

	tableHeader: {
		fontWeight: 'bold',
		minHeight: 24,
	},

	// Cells width: TT: 6%, Tên hàng: 46%, ĐV: 10%, SL: 10%, Đơn giá: 14%, Thành tiền: 14%
	colTT: {
		width: '6%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	colName: {
		width: '46%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 6,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},

	colUnit: {
		width: '10%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	colQuantity: {
		width: '10%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	colPrice: {
		width: '14%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 6,
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},

	colSubtotal: {
		width: '14%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 3,
		paddingHorizontal: 6,
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},

	headerText: {
		fontWeight: 'bold',
		fontSize: 10,
		color: '#000000',
	},

	cellText: {
		fontSize: 10,
		color: '#000000',
	},

	// Table footer total
	totalLabelCol: {
		width: '62%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 4,
		paddingHorizontal: 6,
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},

	totalQuantityCol: {
		width: '10%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 4,
		paddingHorizontal: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	totalAmountCol: {
		width: '28%',
		borderRightWidth: 1,
		borderColor: '#000000',
		paddingVertical: 4,
		paddingHorizontal: 6,
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},

	totalText: {
		fontWeight: 'bold',
		fontSize: 10,
		color: '#000000',
	},

	// Bottom section under table (BỎ HOÀN TOÀN KHUNG THANH TOÁN)
	bottomSection: {
		marginTop: 8,
	},

	noteContainer: {
		fontSize: 9,
		fontStyle: 'italic',
		display: 'flex',
		flexDirection: 'column',
		gap: 3,
		color: '#000000',
	},

	// Signatures
	signatureSection: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 24,
		minHeight: 65,
		textAlign: 'center',
	},

	signatureBlock: {
		width: '42%',
		textAlign: 'center',
	},

	signatureRole: {
		fontWeight: 'bold',
		fontSize: 10.5,
		marginBottom: 3,
		textAlign: 'center',
		color: '#000000',
	},

	signatureNote: {
		fontSize: 8.5,
		fontStyle: 'italic',
		textAlign: 'center',
		color: '#000000',
	},
});

const DEFAULT_STORE_INFO = {
	name: 'Văn Phòng Phẩm Huyền Anh',
	line1: 'Chuyên kinh doanh văn phòng phẩm, đồ dùng học sinh & quà lưu niệm',
	address: 'Phố mới Tân Sơn, Đường Đôi, TT. Thổ Tang, Vĩnh Tường, Vĩnh Phúc',
	phones: '0372.505.304 (Uyên) - 0979.140.786 (Lan) - 0356.996.733 (Tuấn Anh)',
};

function InvoicePDF({order, orders, storeInfo}: PropsInvoicePDF) {
	const store = {
		name: storeInfo?.name || DEFAULT_STORE_INFO.name,
		line1: DEFAULT_STORE_INFO.line1,
		address: storeInfo?.address || DEFAULT_STORE_INFO.address,
		phones: storeInfo?.phones || DEFAULT_STORE_INFO.phones,
	};

	const orderList = orders && orders.length > 0 ? orders : order ? [order] : [];

	return (
		<Document>
			{orderList.map((currentOrder, idx) => {
				const items = currentOrder?.items || [];
				const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
				const totalAmount = currentOrder?.total_amount || 0;

				return (
					<Page key={currentOrder?._id || idx} size='A4' style={styles.page}>
						{/* Header: Thông tin cửa hàng & Số phiếu */}
						<View style={styles.headerContainer}>
							<View style={styles.storeInfo}>
								<Text style={styles.storeName}>{store.name}</Text>
								<Text style={styles.storeSub}>{store.line1}</Text>
								<Text style={styles.storeSub}>Địa chỉ: {store.address}</Text>
								<Text style={styles.storeSub}>Điện thoại: {store.phones}</Text>
							</View>

							<View style={styles.orderBadgeContainer}>
								<Text style={styles.orderCodeValue}>Số phiếu: {currentOrder?.code || '---'}</Text>
							</View>
						</View>

						{/* Title: PHIẾU XUẤT HÀNG */}
						<View style={styles.titleContainer}>
							<Text style={styles.mainTitle}>PHIẾU XUẤT HÀNG</Text>
							<Text style={styles.subTitleDate}>
								Ngày:{' '}
								{currentOrder?.created_at
									? moment(currentOrder.created_at).format('DD/MM/YYYY HH:mm')
									: moment().format('DD/MM/YYYY HH:mm')}
							</Text>
						</View>

						{/* Thông tin khách hàng (Có dòng Ghi chú cố định) */}
						<View style={styles.customerSection}>
							<View style={styles.infoRow}>
								<View style={styles.infoColLeft}>
									<Text style={styles.infoLabel}>Khách hàng:</Text>
									<Text style={styles.infoValue}>{currentOrder?.customer_name || 'Khách lẻ'}</Text>
								</View>
								<View style={styles.infoColRight}>
									<Text style={styles.infoLabel}>Điện thoại:</Text>
									<Text style={styles.infoValue}>{currentOrder?.customer_phone || ''}</Text>
								</View>
							</View>

							<View style={styles.infoRow}>
								<View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
									<Text style={styles.infoLabel}>Địa chỉ:</Text>
									<Text style={styles.infoValue}>{currentOrder?.shipping_address || ''}</Text>
								</View>
							</View>

							<View style={styles.infoRow}>
								<View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
									<Text style={styles.infoLabel}>Ghi chú:</Text>
									<Text style={styles.infoValue}>{currentOrder?.customer_note || ''}</Text>
								</View>
							</View>
						</View>

						{/* Bảng sản phẩm liền nhau hoàn toàn (View cells, seamless borders) */}
						<View style={styles.table}>
							{/* Table Header */}
							<View style={[styles.tableRow, styles.tableHeader]}>
								<View style={styles.colTT}>
									<Text style={styles.headerText}>TT</Text>
								</View>
								<View style={styles.colName}>
									<Text style={styles.headerText}>Tên hàng</Text>
								</View>
								<View style={styles.colUnit}>
									<Text style={styles.headerText}>ĐV</Text>
								</View>
								<View style={styles.colQuantity}>
									<Text style={styles.headerText}>SL</Text>
								</View>
								<View style={styles.colPrice}>
									<Text style={styles.headerText}>Đơn giá</Text>
								</View>
								<View style={styles.colSubtotal}>
									<Text style={styles.headerText}>Thành tiền</Text>
								</View>
							</View>

							{/* Table Body */}
							{items.map((item, index) => {
								const subtotal = item.subtotal || item.price * item.quantity;
								return (
									<View key={index} style={styles.tableRow}>
										<View style={styles.colTT}>
											<Text style={styles.cellText}>{index + 1}</Text>
										</View>
										<View style={styles.colName}>
											<Text style={styles.cellText}>{item.product_name}</Text>
										</View>
										<View style={styles.colUnit}>
											<Text style={styles.cellText}>{item.pack_size || ''}</Text>
										</View>
										<View style={styles.colQuantity}>
											<Text style={styles.cellText}>{item.quantity}</Text>
										</View>
										<View style={styles.colPrice}>
											<Text style={styles.cellText}>{convertCoin(item.price)}</Text>
										</View>
										<View style={styles.colSubtotal}>
											<Text style={styles.cellText}>{convertCoin(subtotal)}</Text>
										</View>
									</View>
								);
							})}

							{/* Row Tổng cộng */}
							<View style={styles.tableRow}>
								<View style={styles.totalLabelCol}>
									<Text style={styles.totalText}>Tổng cộng:</Text>
								</View>
								<View style={styles.totalQuantityCol}>
									<Text style={styles.totalText}>{totalQuantity}</Text>
								</View>
								<View style={styles.totalAmountCol}>
									<Text style={styles.totalText}>{convertCoin(totalAmount)}</Text>
								</View>
							</View>
						</View>

						{/* Phần ghi chú dưới bảng (ĐÃ BỎ PHẦN THANH TOÁN) */}
						<View style={styles.bottomSection}>
							<View style={styles.noteContainer}>
								<Text>Lưu ý: Quý khách vui lòng kiểm tra hàng hóa trước khi ra về.</Text>
								<Text>Trân trọng cảm ơn.</Text>
							</View>
						</View>

						{/* Chữ ký hai bên */}
						<View style={styles.signatureSection}>
							<View style={styles.signatureBlock}>
								<Text style={styles.signatureRole}>Người bán hàng</Text>
								<Text style={styles.signatureNote}>(Ký, ghi rõ họ tên)</Text>
							</View>

							<View style={styles.signatureBlock}>
								<Text style={styles.signatureRole}>Khách hàng</Text>
								<Text style={styles.signatureNote}>(Ký, ghi rõ họ tên)</Text>
							</View>
						</View>
					</Page>
				);
			})}
		</Document>
	);
}

export default InvoicePDF;
