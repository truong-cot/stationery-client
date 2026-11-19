export const flyToCart = (img: HTMLImageElement, cartEl?: HTMLElement | null) => {
	if (!img) return;

	// Kiểm tra chế độ màn hình mobile hay desktop
	const isMobile = window.innerWidth <= 768;
	const bottomCartEl = document.querySelector('#cart-bottom-icon') as HTMLElement | null;
	const topCartEl = document.querySelector('#cart-icon') as HTMLElement | null;

	// Ưu tiên chọn đích đến chuẩn xác theo thiết bị
	let targetEl: HTMLElement | null = null;
	if (isMobile && bottomCartEl) {
		targetEl = bottomCartEl;
	} else if (topCartEl) {
		targetEl = topCartEl;
	} else {
		targetEl = cartEl || bottomCartEl || null;
	}

	if (!targetEl) return;

	// Nếu targetEl là button chứa cart_icon_wrap, lấy chính xác icon wrap để bay vào tâm icon
	const iconWrap = targetEl.querySelector('[class*="cart_icon_wrap"]') as HTMLElement | null;
	const elementToTrack = iconWrap || targetEl;
	const cartRect = elementToTrack.getBoundingClientRect();

	// Fallback nếu target đang bị ẩn hoặc không có kích thước
	let finalRect = cartRect;
	if ((finalRect.width === 0 || finalRect.height === 0) && topCartEl) {
		const topIconWrap = topCartEl.querySelector('[class*="cart_icon_wrap"]') as HTMLElement | null;
		finalRect = (topIconWrap || topCartEl).getBoundingClientRect();
	}

	const imgRect = img.getBoundingClientRect();

	const clone = img.cloneNode(true) as HTMLImageElement;

	clone.style.position = 'fixed';
	clone.style.left = `${imgRect.left}px`;
	clone.style.top = `${imgRect.top}px`;
	clone.style.width = `${imgRect.width}px`;
	clone.style.height = `${imgRect.height}px`;
	clone.style.zIndex = '99999';
	clone.style.borderRadius = '12px';
	clone.style.transition = 'all 0.8s cubic-bezier(.65,.05,.36,1)';
	clone.style.pointerEvents = 'none';
	clone.style.objectFit = 'cover';
	clone.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';

	document.body.appendChild(clone);

	// Tính toán tâm của icon giỏ hàng đích đến
	const targetX = finalRect.left + finalRect.width / 2 - 10;
	const targetY = finalRect.top + finalRect.height / 2 - 10;

	requestAnimationFrame(() => {
		clone.style.left = `${targetX}px`;
		clone.style.top = `${targetY}px`;
		clone.style.width = '20px';
		clone.style.height = '20px';
		clone.style.opacity = '0.35';
		clone.style.borderRadius = '50%';
		clone.style.transform = 'scale(0.8)';
	});

	setTimeout(() => {
		if (clone.parentNode) {
			clone.parentNode.removeChild(clone);
		}
	}, 800);
};
