// Hàm chuyển đổi số coin thành chuỗi định dạng tiền tệ
export const convertCoin = (coin: number | null) => {
	return coin ? coin.toLocaleString('de-DE', {maximumFractionDigits: 2}) : '0';
};

// Hàm chuyển đổi chuỗi hoặc số thành giá trị số
export const price = (value: string | number): number => {
	const numericValue = Number(`${value}`.replace(/[^0-9,]/g, '').replace(',', '.'));
	return isNaN(numericValue) ? 0 : numericValue;
};

export const renderRangePrice = ({min, max}: {min: number; max: number}): string => {
	if (min == 0) return `Giá dưới ${convertCoin(max)}đ`;

	if (max == 0) return `Giá trên ${convertCoin(min)}đ`;

	return `${convertCoin(min)}đ - ${convertCoin(max)}đ`;
};
