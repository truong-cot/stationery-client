import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IDataLoginStorage {
	usernameStorage: string;
	passwordStorage: string;
}
interface AuthState {
	rememberPassword: boolean;
	access_token: string;
	isLogin: boolean;
	isLoading: boolean;
	isSplashDone: boolean;
	dataLoginStorage: IDataLoginStorage | null;
}

const initialState: AuthState = {
	rememberPassword: false,
	access_token: '',
	isLogin: false,
	isLoading: true,
	isSplashDone: false,
	dataLoginStorage: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setRememberPassword: (state, action: PayloadAction<boolean>) => {
			state.rememberPassword = action?.payload;
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.access_token = action?.payload;
		},
		setStateLogin: (state, action: {payload: boolean}) => {
			state.isLogin = action?.payload;
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action?.payload;
		},
		setIsSplashDone: (state, action: PayloadAction<boolean>) => {
			state.isSplashDone = action?.payload;
		},
		logout: (state) => {
			state.access_token = '';
			state.isLogin = false;
		},
		setDataLoginStorage: (state, action: PayloadAction<IDataLoginStorage | null>) => {
			state.dataLoginStorage = action?.payload;
		},
	},
});

export const {setRememberPassword, setAccessToken, setStateLogin, setIsLoading, setIsSplashDone, logout, setDataLoginStorage} = authSlice.actions;
export default authSlice.reducer;
