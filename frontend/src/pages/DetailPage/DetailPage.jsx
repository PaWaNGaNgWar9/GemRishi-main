import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderDetailPage from "./HeaderDetailPage";
import OrderDelivery from "./OrderDelivery";
import ProductDescription from "./ProductDescription";
import OtherGemstone from "./OtherGemstone";
import TrustBadges from "../../components/trust";
import BlueSapphireJewellery from "../../components/BlueSapphireJewellery";
import UserTestimonials from "../../components/UserTestimonals";

function DetailPage() {
	const { slug } = useParams();
	const [gemstoneId, setGemstoneId] = useState(null);

	// ✅ ADDED useEffect to scroll to the top when the component mounts or the slug changes
	useEffect(() => {
		// Scroll the window to the top (0, 0 coordinates) smoothly
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [slug]); // Re-run effect if the slug changes (for dynamic routes within the same component)

	return (
		<>
			<HeaderDetailPage slug={slug} onSendId={(id) => setGemstoneId(id)} />
			<ProductDescription />
			<OtherGemstone />
			<BlueSapphireJewellery gemstone="blue-sapphire" gemstoneId={gemstoneId} />
			<div className="mt-24 mb-10">
				{/* <UserTestimonials/> */}
			</div>
		</>
	);
}

export default DetailPage;
