export enum ORDER_STATUS {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	SUCCESS = 'SUCCESS',
	CANCELLED = 'CANCELLED',
}

export const listStateOrder = [
	{
		state: ORDER_STATUS.PENDING,
		text: 'Chờ xác nhận',
		textColor: '#D97706',
		backgroundColor: '#FEF3C7',
	},
	{
		state: ORDER_STATUS.COMPLETED,
		text: 'Đã xác nhận',
		textColor: '#2563EB',
		backgroundColor: '#DBEAFE',
	},
	{
		state: ORDER_STATUS.SUCCESS,
		text: 'Giao thành công',
		textColor: '#16A34A',
		backgroundColor: '#DCFCE7',
	},
	{
		state: ORDER_STATUS.CANCELLED,
		text: 'Đã hủy',
		textColor: '#DC2626',
		backgroundColor: '#FEE2E2',
	},
];

export const listClientStateOrder = [
	{
		state: ORDER_STATUS.PENDING,
		text: 'Đang chờ xác nhận',
		description: 'Đơn hàng đã gửi thành công, nhân viên đang duyệt đơn.',
		textColor: '#D97706',
		backgroundColor: '#FEF3C7',
	},
	{
		state: ORDER_STATUS.COMPLETED,
		text: 'Đã xác nhận',
		description: 'Cửa hàng đã xác nhận đơn và đang chuẩn bị hàng gửi cho đơn vị vận chuyển.',
		textColor: '#2563EB',
		backgroundColor: '#DBEAFE',
	},
	{
		state: ORDER_STATUS.SUCCESS,
		text: 'Giao hàng thành công',
		description: 'Đơn hàng đã được giao đến tay khách thành công.',
		textColor: '#16A34A',
		backgroundColor: '#DCFCE7',
	},
	{
		state: ORDER_STATUS.CANCELLED,
		text: 'Đã hủy',
		description: 'Đơn hàng bị hủy do hết hàng hoặc theo yêu cầu khách.',
		textColor: '#DC2626',
		backgroundColor: '#FEE2E2',
	},
];

export const listOptionOrderStatus = [
	{
		uuid: ORDER_STATUS.PENDING,
		name: 'Chờ xác nhận',
	},
	{
		uuid: ORDER_STATUS.COMPLETED,
		name: 'Đã xác nhận',
	},
	{
		uuid: ORDER_STATUS.SUCCESS,
		name: 'Giao thành công',
	},
	{
		uuid: ORDER_STATUS.CANCELLED,
		name: 'Đã hủy',
	},
];

export const getNextOrderStatusOptions = (currentStatus: string) => {
	switch (currentStatus) {
		case ORDER_STATUS.PENDING:
			return [
				{
					uuid: ORDER_STATUS.COMPLETED,
					name: 'Xác nhận đơn hàng (COMPLETED)',
				},
				{
					uuid: ORDER_STATUS.CANCELLED,
					name: 'Hủy đơn hàng (CANCELLED)',
				},
			];
		case ORDER_STATUS.COMPLETED:
			return [
				{
					uuid: ORDER_STATUS.SUCCESS,
					name: 'Giao thành công (SUCCESS)',
				},
				{
					uuid: ORDER_STATUS.CANCELLED,
					name: 'Hủy đơn hàng (CANCELLED)',
				},
			];
		default:
			return [];
	}
};

