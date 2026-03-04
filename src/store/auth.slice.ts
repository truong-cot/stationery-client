import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
	rememberPassword: boolean;
	access_token: string;
	isLogin: boolean;
	isLoading: boolean;
}

const initialState: AuthState = {
	rememberPassword: false,
	access_token: '',
	isLogin: false,
	isLoading: true,
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
		logout: (state) => {
			state.access_token = '';
			state.isLogin = false;
		},
	},
});

export const {setRememberPassword, setAccessToken, setStateLogin, setIsLoading, logout} = authSlice.actions;
export default authSlice.reducer;
