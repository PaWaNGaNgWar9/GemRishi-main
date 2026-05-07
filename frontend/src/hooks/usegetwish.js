import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

export const useGetWish = () => {
	const [wishlist, setWishlist] = useState([]);
	const [metalRates, setMetalRates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	
		const fetchWishlist = async () => {
			try {
				const userInfo = JSON.parse(localStorage.getItem("userInfo"));
				const token = userInfo?.token;
				if (!token) throw new Error("User not authenticated");

				const response = await axios.get(
					`${API_URL}/wishlist/get_all_wishlist`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setWishlist(response.data.wishlist || []);
				setMetalRates(response.data.metalRates || []);
				//console.log("Wishlist", response);
			} catch (err) {
				
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		useEffect(() => {
			fetchWishlist();
		}, []);

	return { wishlist, metalRates, loading, error, setWishlist, setMetalRates };
};
