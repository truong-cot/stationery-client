import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInfoUser {
  _id: string;
  name: string;
  username: string;
  description: string;
}

interface UserState {
  infoUser: IInfoUser | null;
}

const initialState: UserState = {
  infoUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInfoUser: (state, action: PayloadAction<IInfoUser | null>) => {
      state.infoUser = action?.payload;
    },
  },
});

export const { setInfoUser } = userSlice.actions;
export default userSlice.reducer;
