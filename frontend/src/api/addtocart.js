import axios from "axios";
const API_URL = import.meta.env.VITE_URL;

export const addItemToCart = async (payload, token) => {
	if (!token) throw new Error("You must be logged in.");

	try {
		const response = await axios.post(
			`${API_URL}/cart/add_item_in_cart`,
			payload,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (err) {
		console.error(
			"Error adding item to cart:",
			err.response?.data || err.message
		);
		throw err;
	}
};
