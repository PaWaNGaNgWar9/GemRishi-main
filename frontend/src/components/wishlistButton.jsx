"use client";

import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import {
	addToWishlist as addWishAPI,
	removeFromWishlist as removeWishAPI,
} from "../api/wishlist";
import {
	addToWishlist as addtowishAction,
	removeFromwishlist as removeWishAction,
} from "../redux/wishlistSlice";
import { clearCart } from "../redux/cartSlice"; // <-- import your clearCart action
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
	position: "top-center",
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	theme: "light",
	style: {
		background: "#ffffff",
		color: "#222",
		borderRadius: "8px",
		fontWeight: "500",
		boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
	},
	zIndex: 9999,
	marginTop: "100px",
};

const WishlistButton = ({ itemId, itemType, clearCartOnRemove = false }) => {
	const dispatch = useDispatch();
	const wishlistItems = useSelector((state) => state.wishlist.items);
	const [loading, setLoading] = useState(false);

	const storedAuth = localStorage.getItem("userInfo");
	const user = storedAuth ? JSON.parse(storedAuth).user : null;

	const [isWishlistedLocal, setIsWishlistedLocal] = useState(false);

	useEffect(() => {
		setIsWishlistedLocal(
			wishlistItems.some(
				(wish) => wish._id === itemId && wish.itemType === itemType
			)
		);
	}, [wishlistItems, itemId, itemType]);

	const handleWishlist = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user || !user._id) {
			toast.dismiss();
			toast.error("Please login to use wishlist", toastOptions);
			return;
		}

		if (loading) return;
		setLoading(true);
		toast.dismiss();

		try {
			if (isWishlistedLocal) {
				const res = await removeWishAPI(itemId, itemType);
				if (res.success === false) {
					toast.error(
						res.message || "Failed to remove from wishlist",
						toastOptions
					);
				} else {
					dispatch(removeWishAction({ _id: itemId, itemType }));
					setIsWishlistedLocal(false);

					// Optional: clear cart when removing from wishlist
					if (clearCartOnRemove) {
						dispatch(clearCart());
						toast.info("Wishlist item removed and cart cleared!", toastOptions);
					} else {
						toast.info("Removed from wishlist", toastOptions);
					}
				}
			} else {
				const res = await addWishAPI(itemId, itemType);
				if (res.success === false) {
					toast.error(res.message || "Failed to add to wishlist", toastOptions);
				} else {
					dispatch(addtowishAction({ _id: itemId, itemType }));
					setIsWishlistedLocal(true);
					toast.success("Added to wishlist", toastOptions);
				}
			}
		} catch (err) {
			console.error("❌ Wishlist error:", err);
			toast.error("Something went wrong!", { ...toastOptions, icon: "⚠️" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleWishlist}
			disabled={loading}
			className="p-1 rounded-full transition"
			aria-label={
				isWishlistedLocal ? "Remove from wishlist" : "Add to wishlist"
			}>
			<Heart
				className={`w-5 h-5 transition cursor-pointer ${
					isWishlistedLocal
						? "text-red-600 fill-red-600"
						: "text-gray-500 hover:text-red-600"
				}`}
				fill="currentColor"
			/>
		</button>
	);
};

export default WishlistButton;
