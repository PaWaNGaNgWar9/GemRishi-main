import { Link } from "react-router-dom";
import { Heart, Play } from "lucide-react";
import WishlistButton from "../components/wishlistButton";
import VideoModal from "./models/VideoModal";
import { useState } from "react";

const SimilarCard = ({
	image,
	title,
	Type,
	price,
	slug,
	videos,
	id,
	itemType,
}) => {
	const [showModal, setShowModal] = useState(false);
	console.log("SimilarCard videos:", title);

	return (
		<div className="flex justify-center">
			<Link
				to={`/details/product/${slug}`}
				className="block group transition-transform duration-300 hover:scale-[1.02]">
				<div className="w-72 bg-white mb-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 relative flex flex-col items-center text-center">
					{/* Icons (top right) */}
					<div className="absolute top-3 right-3 flex gap-2">
						<WishlistButton itemId={id} itemType={itemType} />
						{videos?.length > 0 && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setShowModal(true);
								}}
								className="p-2 rounded-full border border-black hover:bg-gray-100 transition flex items-center justify-center cursor-pointer">
								<Play className="w-4 h-4 text-gray-700" />
							</button>
						)}
					</div>

					{/* Product Image */}
					<div className="flex justify-center items-center w-full h-44 mb-4">
						<img
							src={image}
							alt={title}
							className="max-h-40 object-contain rounded-md"
						/>
					</div>

					{/* Product Title */}
					<h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>

					{/* Type */}
					{Type && <p className="text-sm text-gray-500 mb-2">Type: {Type}</p>}

					{/* Price */}
					<p className="text-md font-semibold text-gray-900">
						{price
							? `₹${price.toLocaleString("en-IN")}`
							: "Price not available"}
					</p>
				</div>
			</Link>

			{/* Video Modal */}
			<VideoModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				videoUrl={videos?.[0]?.url}
			/>
		</div>
	);
};

export default SimilarCard;
