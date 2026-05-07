import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

/**
 * Fetch single gemstone details by slug
 * @param {string} slug - Gemstone slug (e.g., "emerald")
 * @returns {Promise<Object>} Gemstone details
 */
export const getGemstoneBySlug = async (slug) => {
	try {
		const response = await axios.get(
			`${API_URL}/product/single-gemstone/${slug}`
		);
		// The gemstone data is inside response.data.product
		return {
			product: response.data.product,
			countryData: response.data.countryData,
		};
	} catch (error) {
		console.error(
			"Error fetching gemstone details:",
			error.response?.data || error.message
		);
		throw error;
	}
};
