import type {Metadata, Viewport} from 'next';

import '../app/styles/_globals.scss';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-share.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'tippy.js/dist/tippy.css';

import 'react-toastify/dist/ReactToastify.css';

import AppProvider from '~/contexts/AppProvider';
import {DEFAULT_OG_IMAGE, SITE_URL} from '~/funcs/seo';

export const metadata: Metadata = {
	title: 'Văn phòng phẩm Huyền Anh',
	description: 'Khám phá, tra cứu và xem thông tin văn phòng phẩm giá cả tốt.',
	alternates: {
		canonical: SITE_URL,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	metadataBase: new URL(SITE_URL),
	openGraph: {
		title: 'Văn phòng phẩm Huyền Anh',
		description: 'Khám phá, tra cứu và xem thông tin văn phòng phẩm giá cả tốt.',
		url: SITE_URL,
		siteName: 'Xanh Stay',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Văn phòng phẩm giá tốt.',
			},
		],
		locale: 'vi_VN',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Văn phòng phẩm giá tốt.',
		description: 'Khám phá, tra cứu và xem thông tin văn phòng phẩm giá cả tốt.',
		images: [DEFAULT_OG_IMAGE],
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<body>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
