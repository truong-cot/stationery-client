'use client';

import {useEffect} from 'react';

declare global {
	interface Window {
		adsbygoogle: Array<Record<string, unknown>>;
	}
}

type Props = {
	slot: string;
	style?: React.CSSProperties;
};

export default function Adsense({slot, style}: Props) {
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {
			console.error('Adsense error:', e);
		}
	}, []);

	return (
		<ins
			className='adsbygoogle'
			style={{display: 'block', ...style}}
			data-ad-client='ca-pub-6676484167876358'
			data-ad-slot={slot}
			data-ad-format='auto'
			data-full-width-responsive='true'
		/>
	);
}
