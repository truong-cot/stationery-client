import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IContact} from '~/page/admin/contact/FormUpdateContact/interfaces';

interface IInfoUser {
	_id: string;
	name: string;
	username: string;
	description: string;
}

interface UserState {
	infoUser: IInfoUser | null;
	contact: IContact | null;
}

const initialState: UserState = {
	infoUser: null,
	contact: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setInfoUser: (state, action: PayloadAction<IInfoUser | null>) => {
			state.infoUser = action?.payload;
		},
		setContact: (state, action: PayloadAction<IContact | null>) => {
			state.contact = action?.payload;
		},
	},
});

export const {setInfoUser, setContact} = userSlice.actions;
export default userSlice.reducer;
