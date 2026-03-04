'use client';

import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import SplashScreen from '~/components/protected/SplashScreen';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import {store} from '~/store';

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
				<SplashScreen />
				<ToastContainer autoClose={3000} />
				{children}
				{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</Provider>
	);
};

export default AppProvider;
