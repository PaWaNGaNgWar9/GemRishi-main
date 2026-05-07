import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
};

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		setWishlist: (state, action) => {
			state.items = action.payload;
		},

		addToWishlist: (state, action) => {
			const exists = state.items.some(
				(wish) =>
					wish._id === action.payload._id &&
					wish.itemType === action.payload.itemType
			);
			if (!exists) {
				state.items.push(action.payload);
			}
		},

		removeFromwishlist: (state, action) => {
			const payload = action.payload;

			state.items = state.items.filter((wish) => {
				if (typeof payload === "string") {
					// Remove by _id only
					return wish.item?._id !== payload && wish._id !== payload;
				} else if (payload._id && payload.itemType) {
					// Remove by ID + type
					return !(
						(wish.item?._id === payload._id || wish._id === payload._id) &&
						wish.itemType === payload.itemType
					);
				}
				return true;
			});
		},

		clearWishlist: (state) => {
			state.items = [];
		},
	},
});

export const { setWishlist, addToWishlist, removeFromwishlist, clearWishlist } =
	wishlistSlice.actions;

export default wishlistSlice.reducer;
