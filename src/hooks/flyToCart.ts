export const flyToCart = (img: HTMLImageElement, cartEl: HTMLElement) => {
	const imgRect = img.getBoundingClientRect();
	const cartRect = cartEl.getBoundingClientRect();

	const clone = img.cloneNode(true) as HTMLImageElement;

	clone.style.position = 'fixed';
	clone.style.left = `${imgRect.left}px`;
	clone.style.top = `${imgRect.top}px`;
	clone.style.width = `${imgRect.width}px`;
	clone.style.height = `${imgRect.height}px`;
	clone.style.zIndex = '9999';
	clone.style.borderRadius = '12px';
	clone.style.transition = 'all 0.8s cubic-bezier(.65,.05,.36,1)';
	clone.style.pointerEvents = 'none';
	clone.style.objectFit = 'cover';

	document.body.appendChild(clone);

	requestAnimationFrame(() => {
		clone.style.left = `${cartRect.left}px`;
		clone.style.top = `${cartRect.top}px`;
		clone.style.width = '20px';
		clone.style.height = '20px';
		clone.style.opacity = '0.5';
	});

	setTimeout(() => {
		if (clone.parentNode) {
			clone.parentNode.removeChild(clone);
		}
	}, 800);
};

