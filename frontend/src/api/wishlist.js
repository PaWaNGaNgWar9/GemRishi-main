import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

export const addToWishlist = async (itemId, itemType) => {
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const token = userInfo?.token;
	if (!token) {
		throw new Error("User not authenticated");
	}

	try {
		const response = await axios.post(
			`${API_URL}/wishlist/add_to_wishlist`,
			{ itemId, itemType },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (err) {
		if (err.response) {
			console.error("❌ Wishlist error:", err.response.data);
		} else if (err.request) {
			console.error("❌ Wishlist request made but no response:", err.request);
		} else {
			console.error("❌ Wishlist error:", err.message);
		}
		return {
			success: false,
			message: err.response?.data?.message || err.message,
		};
	}
};

export const removeFromWishlist = async (itemId) => {
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const token = userInfo?.token;
	if (!token) {
		throw new Error("User not authenticated");
	}

	try {
		const response = await axios.delete(
			`${API_URL}/wishlist/remove_from_wishlist`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					itemId,
				},
			}
		);
		return response.data;
	} catch (err) {
		console.error(
			"❌ Remove wishlist error:",
			err.response?.data || err.message
		);
		throw err;
	}
};

export const getWishlist = async () => {
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const token = userInfo?.token;
	if (!token) throw new Error("User not authenticated");

	try {
		const response = await axios.get(`${API_URL}/wishlist/get_all_wishlist`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (err) {
		console.error(
			"❌ Fetch wishlist error:",
			err.response?.data || err.message
		);
		throw err;
	}
};
