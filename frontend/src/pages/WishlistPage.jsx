import React, { useState } from "react";
import { useGetWish } from "../hooks/usegetwish";
import { MdDelete } from "react-icons/md";
import { removeFromWishlist as removeWishAPI } from "../api/wishlist"; // ✅ API
import { removeFromwishlist } from "../redux/wishlistSlice"; // ✅ Redux action

import { addItemToCart as addToCartAction } from "../redux/cartSlice";
import { addItemToCart } from "../api/addtocart";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { appendRandomString } from "../utils/randomString";

// ✅ Skeleton Loader
const WishlistItemSkeleton = () => (
	<div className="relative group w-72 bg-white shadow-lg rounded-xl p-4 transition overflow-hidden animate-pulse">
		<div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full z-20"></div>
		<div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
		<div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
		<div className="h-4 w-1/2 bg-gray-200 rounded mb-1"></div>
		<div className="h-4 w-1/4 bg-gray-200 rounded"></div>
	</div>
);

const WishlistPage = () => {
	const dispatch = useDispatch();
	const { wishlist, metalRates, loading, error, setWishlist } = useGetWish();
	const [addingToCart, setAddingToCart] = useState(false);

	const handleRemove = async (productId) => {
		try {
			const response = await removeWishAPI(productId);

			if (response.success) {
				dispatch(removeFromwishlist(productId));

				setWishlist((prev) =>
					prev.filter((wish) => {
						if (wish.itemType === "Jewelry") return wish.item._id !== productId;
						if (wish.itemType === "Product") return wish.item._id !== productId;
						return true;
					})
				);

				toast.success("Removed from wishlist ✅", { position: "top-center" });
			} else {
				toast.error(
					response.message || "Failed to remove item from wishlist.",
					{ position: "top-center" }
				);
			}
		} catch (err) {
			console.error("Error removing item:", err);
			toast.error("Failed to remove item from wishlist.", {
				position: "top-center",
			});
		}
	};


	// ✅ Move to cart handler
	const handleMoveToCart = async (wishItem) => {
		try {
			// console.log("🧩 Wish item:", wishItem);

			const product = wishItem.itemId; // assuming wishItem.itemId has product data

			const customization = {
				gemstoneWeight: product?.gemstoneWeight
					? {
						weight: product.gemstoneWeight.weight || null,
						price: product.gemstoneWeight.price || 0,
					}
					: null,
				certificate: product?.certificate
					? {
						certificateType: product.certificate.certificateType || "None",
						price: product.certificate.price || 0,
					}
					: null,
				goldKarat:
					product?.metal?.toLowerCase() === "gold"
						? {
							karatType:
								product.defaultPurity === "24k"
									? "gold24k"
									: product.defaultPurity === "22k"
										? "gold22k"
										: "gold18k",
							price:
								product.defaultPurity === "24k"
									? product.goldRates?.gold24k?.withGSTRate *
									product.jewelryMetalWeight
									: product.defaultPurity === "22k"
										? product.goldRates?.gold22k?.withGSTRate *
										product.jewelryMetalWeight
										: product.goldRates?.gold18k?.withGSTRate *
										product.jewelryMetalWeight,
						}
						: null,
			};

			const payload = {
				itemId: product?._id,
				quantity: 1,
				customization: JSON.stringify(customization),
			};

			const response = await addItemToCart(payload, token);

			if (response.success) {
				dispatch(addItemToCart({ itemId: product._id, quantity: 1 }));
				dispatch(removeFromwishlist(wishItem));
				await removeWishAPI(wishItem._id);

				toast.success("Item moved to cart successfully!");
			} else {
				toast.error(response.message || "Failed to move item to cart.");
			}
		} catch (err) {
			console.error("Move to cart error:", err);
			toast.error("Something went wrong while moving item to cart.");
		}
	};

	// ✅ Calculate price
	const calculatePrice = (item, itemType) => {
		let price = 0;

		if (itemType === "Product") {
			price = item?.price || 0;
		} else {
			const jewelryPrice = item?.jewelryPrice || 0;
			const jewelryMetalWeight = item?.jewelryMetalWeight || 0;
			const metal = item?.metal?.toLowerCase();

			if (!metal || !metalRates?.[metal]) {
				console.warn(`Metal rate not found for ${metal}`);
				return jewelryPrice;
			}

			if (metal === "gold") {
				price =
					jewelryPrice +
					(metalRates[metal]?.gold24k?.withGSTRate || 0) * jewelryMetalWeight;
			} else {
				price =
					jewelryPrice +
					(metalRates[metal]?.withGSTRate || 0) * jewelryMetalWeight;
			}
		}
		return price;
	};

	return (
		<div className="max-w-7xl mx-auto">

			<div className="p-6">
				<h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

				{/* ✅ Error */}
				{error && (
					<p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2 max-w-md mx-auto my-4">
						{error}
					</p>
				)}

				{/* ✅ Loading */}
				{loading && (
					<div className="flex flex-wrap justify-center gap-x-8 gap-y-6 py-10">
						<WishlistItemSkeleton />
						<WishlistItemSkeleton />
						<WishlistItemSkeleton />
					</div>
				)}

				{/* ✅ Wishlist display */}
				{!loading && !error && (
					<>
						{wishlist.length === 0 ? (
							<div className="text-center py-20 bg-gray-50 rounded-lg shadow-inner">
								<p className="text-gray-500 text-lg mb-4">
									No product in Wishlist
								</p>
								<Link to="/">
									<button className="bg-[#264A3F] px-8 py-3 rounded-md text-white font-semibold hover:bg-[#1a3329] transition mt-6">
										Back to Shopping
									</button>
								</Link>
							</div>
						) : (
							<div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
								{wishlist.map((wish) => {
									const item = wish.item;
									// console.log("item:", item);
									const productUrl = item.jewelryName ? appendRandomString(`/details/product/${item.slug}`) : appendRandomString(`/gemstones/${item.slug}`);
									const price = calculatePrice(item, wish.itemType);

									return (
										<div
											key={wish._id}
											className="relative group w-72 bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition overflow-hidden border border-gray-100">
											<button
												className="absolute top-3 right-3 text-red-600 hover:text-red-800 bg-white/70 hover:bg-white rounded-full p-1 transition cursor-pointer z-20 shadow-md"
												onClick={() => handleRemove(item._id)}>
												<MdDelete className="w-6 h-6" />
											</button>

											<Link to={productUrl} className="block">
												<img
													src={item.images?.[0]?.url}
													alt={item.name || item.jewelryName}
													className="w-full h-48 object-cover rounded-lg mb-4 transform group-hover:scale-[1.03] transition duration-300"
												/>
											</Link>

											<h2 className="text-lg font-semibold truncate mb-1">
												{item.name || item.jewelryName}
											</h2>
											<p className="text-gray-600 font-medium">
												Price: ₹ {price}
											</p>
											<p
												className={`mt-1 text-sm font-medium ${item.isAvailable ? "text-green-600" : "text-red-500"
													}`}>
												{item.isAvailable ? "In Stock" : "Out of Stock"}
											</p>

											{/* ✅ Hover overlay */}
											<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl px-4">
												<Link to={productUrl} className="w-full">
													<button
														onClick={(e) => e.stopPropagation()}
														className="bg-white text-[#264A3F] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition w-full cursor cursor-pointer ">
														View Details
													</button>
												</Link>
												{/*
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleMoveToCart(item);
													}}
													disabled={addingToCart}
													className="bg-[#264A3F] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#1a3329] transition w-full disabled:opacity-50 cursor cursor-pointer">
													{addingToCart ? "Adding..." : "Move to Cart"}
												</button> */}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</>
				)}
			</div>

			{/* ✅ Continue Shopping button */}
			{!loading && wishlist.length > 0 && (
				<div className="flex justify-center my-12">
					<Link to="/">
						<button className="bg-[#FD3C3F] px-8 py-3 rounded-md text-white font-semibold hover:bg-red-600 transition shadow-lg">
							Continue Shopping
						</button>
					</Link>
				</div>
			)}
		</div>
	);
};

export default WishlistPage;
