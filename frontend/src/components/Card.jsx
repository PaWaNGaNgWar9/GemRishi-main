import { Link } from "react-router-dom";
import { Heart, Play } from "lucide-react";
import WishlistButton from "../components/wishlistButton";
import VideoModal from "./models/VideoModal";
import { useState } from "react";
import Price from "../components/Price"

const Card = ({
	image,
	title,
	origin,
	Type,
	jewelryPrice,
	slug,
	videos,
	id,
	itemType,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [imgError, setImgError] = useState(false);

	const handleImageError = () => {
		setImgError(true);
		console.warn(`Image failed to load: ${image}`);
	};

	return (
		<div>
			<Link to={`/details/product/${slug}`} className="block group h-full">
				<div className="w-full h-full bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8 pb-6 border border-gray-100 flex flex-col justify-between items-center relative">
					{/* Icons (top right) */}
					<div className="absolute top-3 right-3 flex gap-2">
						{/* Heart Button */}
						<WishlistButton itemId={id} itemType={itemType} />

						{/* Play video button */}
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
					<div className="w-full px-4 sm:px-6 mb-3 sm:mb-4 flex-grow flex items-center justify-center">
						{!imgError && image ? (
							<img
								src={image}
								alt={title}
								className="w-full h-[140px] sm:h-[180px] lg:h-[220px] object-contain group-hover:scale-105 transition-transform duration-500"
								onError={handleImageError}
							/>
						) : (
							<div className="flex flex-col items-center justify-center text-gray-400">
								<div className="text-4xl mb-2">📷</div>
								<p className="text-sm">No image available</p>
							</div>
						)}
					</div>

					{/* Card Text Content Details */}
					<div className="flex flex-col items-center w-full px-3 mt-auto">
						{/* Product Title */}
						<h2 className="text-sm sm:text-[15px] font-bold text-center text-[#0B1D3A] line-clamp-2 leading-snug break-words w-full">{title}</h2>

						{/* Origin */}
						{Type && (
							<span className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs px-2.5 py-1 rounded-md mt-2 border border-gray-100 text-center">
								Origin: {Type}
							</span>
						)}

						{/* Price */}
						<p className="text-sm sm:text-base text-[#264A3F] mt-3 font-bold text-center">
							{jewelryPrice != null ? <Price amount={jewelryPrice} /> : "Price on request"}
						</p>
					</div>
				</div>
			</Link>
			<VideoModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				videoUrl={videos?.[0]?.url}
			/>
		</div>
	);
};

export default Card;

//text-center text-lg font-bold text-gray-900 mt-2 