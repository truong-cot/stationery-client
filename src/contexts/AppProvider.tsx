'use client';

import {Suspense, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import SplashScreen from '~/components/protected/SplashScreen';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import {store} from '~/store';
import QuickFilterCategory from '~/components/protected/QuickFilterCategory';

const AppProvider = ({children}: {children: React.ReactNode}) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
						staleTime: 1000 * 60 * 2,
					},
					mutations: {
						retry: 0,
					},
				},
			})
	);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<ToastContainer autoClose={3000} />
				<SplashScreen />
				<Suspense>
					<QuickFilterCategory />
				</Suspense>
				{children}
				{process.env.NODE_ENV === 'development' && (
					<ReactQueryDevtools initialIsOpen={false} position='left' buttonPosition='bottom-left' />
				)}
			</QueryClientProvider>
		</Provider>
	);
};

export default AppProvider;
