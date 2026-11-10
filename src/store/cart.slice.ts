import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ICartProduct {
	_id: string;
	name: string;
	price: number;
	pack_size?: string;
	image: string;
}

export interface ICartItem {
	product: ICartProduct;
	quantity: number;
}

interface CartState {
	carts: ICartItem[];
	isOpenCart: boolean;
}

const initialState: CartState = {
	carts: [],
	isOpenCart: false,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCarts: (state, action: PayloadAction<ICartItem[]>) => {
			state.carts = action.payload;
		},

		setOpenCart: (state, action: PayloadAction<boolean>) => {
			state.isOpenCart = action.payload;
		},

		addToCart: (state, action: PayloadAction<ICartItem>) => {
			const newItem = action.payload;

			if (!newItem?.product?._id || newItem.quantity <= 0) return;

			const existingProduct = state.carts.find((item) => item.product._id === newItem.product._id);

			if (!existingProduct) {
				state.carts.push(newItem);
				return;
			}

			existingProduct.quantity += newItem.quantity;
			existingProduct.product = newItem.product;
		},

		increaseQuantity: (state, action: PayloadAction<string>) => {
			const item = state.carts.find((i) => i.product._id === action.payload);

			if (item) {
				item.quantity += 1;
			}
		},

		updateQuantity: (
			state,
			action: PayloadAction<{
				productId: string;
				quantity: number;
			}>
		) => {
			const item = state.carts.find((i) => i.product._id === action.payload.productId);

			if (item) {
				item.quantity = action.payload.quantity;

				if (item.quantity <= 0) {
					state.carts = state.carts.filter((i) => i.product._id !== action.payload.productId);
				}
			}
		},

		decreaseQuantity: (state, action: PayloadAction<string>) => {
			const item = state.carts.find((i) => i.product._id === action.payload);

			if (!item) return;

			item.quantity -= 1;

			if (item.quantity <= 0) {
				state.carts = state.carts.filter((i) => i.product._id !== action.payload);
			}
		},

		removeFromCart: (state, action: PayloadAction<string>) => {
			state.carts = state.carts.filter((i) => i.product._id !== action.payload);
		},

		clearCart: (state) => {
			state.carts = [];
		},
	},
});

export const {setCarts, setOpenCart, addToCart, increaseQuantity, updateQuantity, decreaseQuantity, removeFromCart, clearCart} =
	cartSlice.actions;

export default cartSlice.reducer;

