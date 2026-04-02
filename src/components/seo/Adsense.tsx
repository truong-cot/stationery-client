'use client';

import {useEffect} from 'react';

declare global {
	interface Window {
		adsbygoogle: any[];
	}
}

export default function Adsense({slot}: {slot: string}) {
	useEffect(() => {
		try {
			const script = document.createElement('script');
			script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6676484167876358`;
			script.async = true;
			script.crossOrigin = 'anonymous';
			document.head.appendChild(script);
		} catch (err) {
			console.error('Error appending AdSense script:', err);
		}
	}, []);

	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('Error pushing AdSense:', err);
		}
	}, []);

	return (
		<ins
			className='adsbygoogle'
			style={{display: 'block'}}
			data-ad-client='ca-pub-6676484167876358'
			data-ad-slot={slot}
			data-ad-format='auto'
			data-full-width-responsive='true'
		/>
	);
}
