'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect, useRef} from 'react';

function ScrollToTop() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const page = searchParams.get('_page');

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		try {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
		} catch {
			window.scrollTo(0, 0);
		}

		requestAnimationFrame(() => {
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		});
	}, [pathname, page]);

	return null;
}

export default ScrollToTop;
