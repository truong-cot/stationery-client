export function removeVietnameseTones(str: string): string {
	return str
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
}

export function formatPhoneVN(phone?: string): string {
	if (!phone) return '';

	let value = phone.replace(/\D/g, '');

	// +84 -> 0
	if (value.startsWith('84')) {
		value = '0' + value.slice(2);
	}

	// format 10 số
	if (value.length === 10) {
		return value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
	}

	// format 11 số (một số số cũ)
	if (value.length === 11) {
		return value.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $3 $4');
	}

	return value;
}
