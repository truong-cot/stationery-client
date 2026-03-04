import {store} from '~/store';
import {toastInfo, toastSuccess, toastWarn} from './toast';
import {logout} from '~/store/auth.slice';
import {setInfoUser} from '~/store/user.slice';
import {deleteCookie} from 'cookies-next/client';
import {COOKIE_KEY} from '~/constants/config';

enum RESPONSE_CODE {
	ERROR,
	SUCCESS,
}

async function delay(duration: number) {
	return await new Promise((resolve) => setTimeout(resolve, duration));
}

export const httpRequest = async ({
	http,
	setLoading,
	msgSuccess,
	showMessageSuccess = false,
	showMessageFailed = false,
}: {
	http: Promise<any>;
	setLoading?: (loading: boolean) => void;
	showMessageSuccess?: boolean;
	showMessageFailed?: boolean;
	msgSuccess?: string;
}) => {
	setLoading?.(true);

	try {
		await delay(500);

		const res: any = await http;

		if (res?.code === RESPONSE_CODE.SUCCESS) {
			if (showMessageSuccess)
				toastSuccess({
					msg: msgSuccess || res?.error?.message || 'Thành công!',
				});

			return res?.data ?? true;
		}

		throw res?.message || 'Thất bại!';
	} catch (err: any) {
		console.log({err});

		if (err?.status === 401 || err?.status === 403) {
			deleteCookie(COOKIE_KEY.ACCESS_TOKEN);
			store.dispatch(logout());
			store.dispatch(setInfoUser(null));
		}

		if (typeof err === 'string') {
			if (showMessageFailed) toastWarn({msg: err});
			throw err;
		}

		if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
			if (showMessageFailed) toastInfo({msg: 'Kiểm tra kết nối internet của bạn!'});

			throw err;
		}

		if (showMessageFailed) toastWarn({msg: err?.data?.message});
		throw err;
	} finally {
		setLoading?.(false);
	}
};
