import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ICartItem {
	cartItemId: string; // Khóa duy nhất: `${product_id}_${classify_id || 'default'}`
	product_id: string; // ID sản phẩm
	product_name: string; // Tên sản phẩm
	product_image: string; // Ảnh sản phẩm
	pack_size?: string; // Quy cách đóng gói
	classify_id?: string | null; // ID phân loại đã chọn (hoặc null)
	classify_name?: string | null; // Tên phân loại (vd: "Xanh lá cây", "Loại I" hoặc null)
	price: number; // Đơn giá
	quantity: number; // Số lượng mua
}

interface CartState {
	carts: ICartItem[];
	isOpenCart: boolean;
}

const initialState: CartState = {
	carts: [],
	isOpenCart: false,
};

const normalizeCartItem = (raw: any): ICartItem => {
	const product_id = raw?.product_id || raw?.product?._id || '';
	const classify_id = raw?.classify_id ?? null;
	const cartItemId = raw?.cartItemId || `${product_id}_${classify_id || 'default'}`;

	return {
		cartItemId,
		product_id,
		product_name: raw?.product_name || raw?.product?.name || '',
		product_image: raw?.product_image || raw?.product?.image || raw?.product?.images?.[0] || '',
		pack_size: raw?.pack_size || raw?.product?.pack_size || '',
		classify_id,
		classify_name: raw?.classify_name ?? null,
		price: Number(raw?.price ?? raw?.product?.price ?? 0),
		quantity: Number(raw?.quantity ?? 1),
	};
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCarts: (state, action: PayloadAction<any[]>) => {
			if (!Array.isArray(action.payload)) {
				state.carts = [];
				return;
			}
			state.carts = action.payload.map(normalizeCartItem).filter((item) => !!item.product_id && item.quantity > 0);
		},

		setOpenCart: (state, action: PayloadAction<boolean>) => {
			state.isOpenCart = action.payload;
		},

		addToCart: (state, action: PayloadAction<any>) => {
			const newItem = normalizeCartItem(action.payload);

			if (!newItem.product_id || newItem.quantity <= 0) return;

			const existingIndex = state.carts.findIndex((item) => item.cartItemId === newItem.cartItemId);

			if (existingIndex > -1) {
				state.carts[existingIndex].quantity += newItem.quantity;
				state.carts[existingIndex].price = newItem.price;
				state.carts[existingIndex].product_name = newItem.product_name;
				state.carts[existingIndex].product_image = newItem.product_image;
				state.carts[existingIndex].pack_size = newItem.pack_size;
				state.carts[existingIndex].classify_name = newItem.classify_name;
			} else {
				state.carts.push(newItem);
			}
		},

		increaseQuantity: (state, action: PayloadAction<string>) => {
			const targetKey = action.payload;
			const item = state.carts.find((i) => i.cartItemId === targetKey || i.product_id === targetKey);

			if (item) {
				item.quantity += 1;
			}
		},

		updateQuantity: (
			state,
			action: PayloadAction<{
				cartItemId?: string;
				productId?: string;
				quantity: number;
			}>
		) => {
			const targetKey = action.payload.cartItemId || action.payload.productId;
			const item = state.carts.find((i) => i.cartItemId === targetKey || i.product_id === targetKey);

			if (item) {
				item.quantity = action.payload.quantity;

				if (item.quantity <= 0) {
					state.carts = state.carts.filter((i) => i.cartItemId !== item.cartItemId);
				}
			}
		},

		decreaseQuantity: (state, action: PayloadAction<string>) => {
			const targetKey = action.payload;
			const item = state.carts.find((i) => i.cartItemId === targetKey || i.product_id === targetKey);

			if (!item) return;

			item.quantity -= 1;

			if (item.quantity <= 0) {
				state.carts = state.carts.filter((i) => i.cartItemId !== item.cartItemId);
			}
		},

		removeFromCart: (state, action: PayloadAction<string>) => {
			const targetKey = action.payload;
			state.carts = state.carts.filter((i) => i.cartItemId !== targetKey && i.product_id !== targetKey);
		},

		clearCart: (state) => {
			state.carts = [];
		},
	},
});

export const {setCarts, setOpenCart, addToCart, increaseQuantity, updateQuantity, decreaseQuantity, removeFromCart, clearCart} =
	cartSlice.actions;

export default cartSlice.reducer;
