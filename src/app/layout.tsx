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
import {DEFAULT_OG_IMAGE, seoKeywords, SITE_URL} from '~/funcs/seo';
import Script from 'next/script';

export const metadata: Metadata = {
	title: {
		default: 'Văn phòng phẩm Huyền Anh - Đồ dùng học sinh & văn phòng phẩm giá tốt',
		template: '%s | Văn phòng phẩm Huyền Anh',
	},
	description:
		'Văn phòng phẩm Huyền Anh chuyên cung cấp sỉ lẻ đồ dùng học tập, thiết bị văn phòng phẩm, bút viết, giấy in, sổ vở chính hãng với giá cả cạnh tranh nhất.',
	keywords: seoKeywords,
	alternates: {
		canonical: SITE_URL,
	},
	icons: {
		icon: '/favicon.ico',
		apple: '/favicon.ico',
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
		title: 'Văn phòng phẩm Huyền Anh - Đồ dùng học sinh & văn phòng phẩm giá tốt',
		description:
			'Văn phòng phẩm Huyền Anh chuyên cung cấp sỉ lẻ đồ dùng học tập, thiết bị văn phòng phẩm, bút viết, giấy in chính hãng với giá tốt nhất.',
		url: SITE_URL,
		siteName: 'Văn phòng phẩm Huyền Anh',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Văn phòng phẩm Huyền Anh',
			},
		],
		locale: 'vi_VN',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Văn phòng phẩm Huyền Anh - Đồ dùng học sinh & văn phòng phẩm giá tốt',
		description:
			'Văn phòng phẩm Huyền Anh chuyên cung cấp sỉ lẻ đồ dùng học tập, thiết bị văn phòng phẩm chính hãng với giá tốt nhất.',
		images: [DEFAULT_OG_IMAGE],
	},
	other: {
		'google-adsense-account': 'ca-pub-6676484167876358',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'OfficeSupplyStore',
	name: 'Văn phòng phẩm Huyền Anh',
	url: SITE_URL,
	logo: `${SITE_URL}/favicon.ico`,
	image: DEFAULT_OG_IMAGE,
	telephone: '0384728493',
	priceRange: '₫₫',
	description:
		'Chuyên cung cấp đồ dùng học tập, văn phòng phẩm & quà lưu niệm chính hãng với giá tốt nhất.',
	address: {
		'@type': 'PostalAddress',
		addressCountry: 'VN',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<head>
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}}
				/>
				<Script
					async
					id='adsense-script'
					strategy='lazyOnload'
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6676484167876358'
					crossOrigin='anonymous'
				></Script>
			</head>
			<body>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
