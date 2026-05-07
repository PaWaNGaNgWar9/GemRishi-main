import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import VideoModal from "./models/VideoModal";
import { useState } from "react";
import WishlistButton from "./wishlistButton";
import { appendRandomString } from "../utils/randomString";

const FilteredCard = ({ image, title, origin, price, slug, videos, id }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<Link to={appendRandomString(`/gemstones/${slug}`)} className="block group">
				<div className="w-72 bg-white mb-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 relative">
					{/* Top-right icons */}
					<div className="absolute top-3 right-3 flex gap-2">
						{/* Heart/Wishlist button */}
						<WishlistButton itemId={id} itemType="Product" />

						{/* Play video button */}
						{videos?.length > 0 && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation(); // Prevent Link navigation
									setShowModal(true);
								}}
								className="p-2 rounded-full border border-black hover:bg-gray-100 transition flex items-center justify-center cursor-pointer">
								<Play className="w-4 h-4 text-gray-700" />
							</button>
						)}
					</div>

					{/* Product image */}
					<img
						src={image}
						alt={title}
						className="w-full h-40 object-contain mb-4"
					/>

					{/* Product details */}
					<h2 className="text-lg font-semibold text-center">{title}</h2>
					<p className="text-gray-600 text-sm text-center mt-1">
						Origin: {origin}
					</p>
					<p className="text-center text-lg font-semibold text-gray-900">
						{price != null
							? `₹${price.toLocaleString()}`
							: "Price not available"}
					</p>
				</div>
			</Link>

			{/* Video modal */}
			<VideoModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				videoUrl={videos?.[0]?.url}
			/>
		</div>
	);
};

export default FilteredCard;
