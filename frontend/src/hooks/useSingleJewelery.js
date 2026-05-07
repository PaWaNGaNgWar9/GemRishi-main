import { useState, useEffect } from "react";
import { getSingleJewelry } from "../api/singlejewelery";
import { getLatestMetalRates } from "../api/metalRates";

export const useSingleJewelry = (slug) => {
	const [data, setData] = useState(null);
	const [metalRates, setMetalRates] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!slug) {
			// console.log("No slug provided, skipping API call");
			return;
		}

		const fetchData = async () => {
			setLoading(true);
			try {
				const productRes = await getSingleJewelry(slug);
				const ratesRes = await getLatestMetalRates(slug);

				setData(productRes.jewelry);

				// Adjust based on backend structure
				setMetalRates(
					ratesRes.result || ratesRes.data || ratesRes.metalRates || ratesRes
				);

				// console.log("Product:", productRes.jewelry);
				// console.log("Metal Rates:", ratesRes);
			} catch (err) {
				setError(
					err.response?.data?.msg ||
						err.message ||
						"Failed to load product or metal rates"
				);
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [slug]);

	return { data, metalRates, loading, error };
};
