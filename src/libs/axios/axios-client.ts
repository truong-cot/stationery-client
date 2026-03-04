import axios from 'axios';
import {getCookie} from 'cookies-next/client';
import {COOKIE_KEY} from '~/constants/config';

const axiosClient = axios.create({
	headers: {
		'content-type': 'application/json',
	},
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 15000,
	timeoutErrorMessage: 'Timeout error request',
});

axiosClient.interceptors.request.use(async (config) => {
	const accessToken = getCookie(COOKIE_KEY.ACCESS_TOKEN);
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

	return config;
});

axiosClient.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response) {
			return Promise.reject(error.response);
		}

		return Promise.reject(error);
	}
);

export default axiosClient;
