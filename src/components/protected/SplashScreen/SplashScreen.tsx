'use client';

import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {deleteCookie, getCookie, setCookie} from 'cookies-next/client';
import dynamic from 'next/dynamic';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {COOKIE_KEY, KEY_STORE} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import {storage} from '~/funcs/storage';
import authServices from '~/services/auth.service';
import {RootState} from '~/store';
import {IDataLoginStorage, setAccessToken, setDataLoginStorage, setIsLoading, setRememberPassword, setStateLogin} from '~/store/auth.slice';
import {ICartItem, setCarts} from '~/store/cart.slice';
import {setInfoUser, setContact} from '~/store/user.slice';
import loadingAnim from '../../../../public/anim/loading_screen.json';
import styles from './SplashScreen.module.scss';
import clientServices from '~/services/client.service';

const Lottie = dynamic(() => import('react-lottie'), {
	ssr: false,
});

export type TypeStorage = {
	rememberPassword: boolean;
	isLogin: boolean;
	dataLoginStorage: IDataLoginStorage | null;
	carts: ICartItem[];
};

function SplashScreen() {
	const dispatch = useDispatch();

	const {rememberPassword, access_token, isLogin, isLoading, dataLoginStorage} = useSelector((state: RootState) => state.auth);
	const {carts} = useSelector((state: RootState) => state.cart);

	useEffect(() => {
		(async () => {
			try {
				const accessToken = getCookie(COOKIE_KEY.ACCESS_TOKEN);
				const cached = storage.get<TypeStorage>(KEY_STORE);

				if (accessToken) dispatch(setAccessToken(accessToken));

				if (cached?.isLogin) dispatch(setStateLogin(cached.isLogin));
				if (cached?.rememberPassword) dispatch(setRememberPassword(cached.rememberPassword));
				if (cached?.dataLoginStorage) dispatch(setDataLoginStorage(cached.dataLoginStorage));
				if (Array.isArray(cached?.carts)) dispatch(setCarts(cached.carts));
			} finally {
				dispatch(setIsLoading(false));
			}
		})();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (!!access_token) {
				setCookie(COOKIE_KEY.ACCESS_TOKEN, access_token, {
					maxAge: 60 * 60 * 24,
				});
			} else deleteCookie(COOKIE_KEY.ACCESS_TOKEN);

			const dataStorage: TypeStorage = {
				isLogin: isLogin,
				rememberPassword: rememberPassword,
				dataLoginStorage: dataLoginStorage,
				carts: carts,
			};

			storage.set(KEY_STORE, dataStorage);
		}
	}, [isLoading, rememberPassword, access_token, isLogin, dataLoginStorage, carts]);

	const {data, isSuccess} = useQuery({
		queryKey: [QUERY_KEY.getProfile, access_token],
		queryFn: () =>
			httpRequest({
				http: authServices.getProfile(),
			}),
		enabled: !!access_token,
	});

	const {data: contact, isSuccess: isSuccessContact} = useQuery({
		queryKey: [QUERY_KEY.getContact],
		queryFn: () =>
			httpRequest({
				http: clientServices.getContact(),
			}),
	});

	useEffect(() => {
		if (isSuccess && !!data) dispatch(setInfoUser(data));
	}, [data, isSuccess]);

	useEffect(() => {
		if (isSuccessContact && !!contact) dispatch(setContact(contact));
	}, [isSuccessContact, contact]);

	return (
		<div className={clsx(styles.container, {[styles.close]: !isLoading})}>
			<div className={styles.logo}>
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: loadingAnim,
					}}
				/>
			</div>
		</div>
	);
}

export default SplashScreen;
