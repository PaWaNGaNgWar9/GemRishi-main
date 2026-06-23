import { useEffect, useState } from "react";
import { getGemstoneBySlug } from "../api/getGemstoneBySlug";

export const useGemstoneBySlug = (slug) => {
	const [product, setProduct] = useState(null);
	const [countryData, setCountryData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!slug) return;

		const fetchGemstone = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await getGemstoneBySlug(slug);
				////console.log("Fetched gemstone data:", data);

				// Destructure the returned object
				setProduct(data.product || null);
				setCountryData(data.countryData || null);

				// console.log("Product set:", data.product);
				// console.log("CountryData set:", data.countryData);
			} catch (err) {
				console.error("Error fetching gemstone:", err);
				setError(err.message || "Failed to fetch gemstone");
			} finally {
				setLoading(false);
			}
		};

		fetchGemstone();
	}, [slug]);

	return { product, countryData, loading, error };
};
