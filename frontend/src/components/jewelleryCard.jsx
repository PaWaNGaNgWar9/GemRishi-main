import React from "react";

const JewelleryCard = ({ image, title, sku, origin, price }) => {
	return (
		<div className="bg-white cursor cursor-pointer rounded-lg shadow-md p-4 w-60 hover:shadow-lg transition-shadow duration-300 ease-in-out hover:scale-105 transition-all delay-300">
			{/* Product Image */}
			<div className="flex justify-center mb-4">
				<img src={image} alt={title} className="w-32 h-32 object-contain" />
			</div>

			{/* Product Details */}
			<div className="text-center">
				{/* Title */}
				<h2 className="font-semibold text-lg text-gray-800">{title}</h2>

				{/* SKU */}
				<p className="text-sm text-gray-500 mt-1">sku: {sku}</p>

				{/* Origin */}
				<p className="text-sm text-gray-500">Origin: {origin}</p>

				{/* Price */}
				<p className="mt-2 text-lg font-semibold text-gray-900">Rs.{price}</p>
			</div>
		</div>
	);
};

export default JewelleryCard;
