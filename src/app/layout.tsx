import type {Metadata} from 'next';
import AppProvider from '~/contexts/AppProvider';

import '../app/styles/_globals.scss';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-share.css';

import 'tippy.js/dist/tippy.css';

import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
	title: 'Văn phòng phẩm',
	description: 'Khám phá, tra cứu và xem thông tin sản phẩm',
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
