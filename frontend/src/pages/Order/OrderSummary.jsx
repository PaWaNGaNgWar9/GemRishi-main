"use client";
import React, { useState, useEffect } from "react";
import BlueSapphire from "../../assets/Stone/BlueSapphire.svg";
import axios from "axios";

function OrderSummary() {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const URL = import.meta.env.VITE_URL;

    const fetchCartItems = async () => {
        const userInfoString = localStorage.getItem("userInfo");
        let userToken = null;

        if (userInfoString) {
            try {
                const userInfo = JSON.parse(userInfoString);
                userToken = userInfo.token;
            } catch (e) {
                console.error("Failed to parse userInfo from localStorage", e);
            }
        }

        if (!userToken) {
            setLoading(false);
            setError("You must be logged in to view your order summary.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${URL}/cart/get_all_cart_list?page=1&limit=10`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            if (response.data?.success && response.data?.cart) {
                setCartData(response.data.cart);
            } else {
                setCartData([]);
            }
        } catch (err) {
            console.error("Error fetching cart items:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load order summary. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const formatPrice = (price) => {
        return `₹ ${price?.toLocaleString("en-IN") || "0"}`;
    };

    // --- CHANGE 1: Calculate total based on item.totalPrice ---
    const calculateTotal = () => {
        return cartData.reduce(
            // Use totalPrice which includes all customizations/quantity for the item
            (total, item) => total + (item.totalPrice || 0),
            0
        );
    };

    if (loading) {
        return (
            <div className="w-full lg:w-[23%] h-auto border-t lg:border-t-0 p-4 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#264A3F]"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full lg:w-[23%] h-auto border-t lg:border-t-0 p-4">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-[23%] h-auto border-t lg:border-t-0">
            <div className="w-full h-[72px] md:h-[90px] border-b-[1px] border-[#D2CFCF] flex items-end">
                <p className="text-[18px] md:text-[20px]  pl-4 md:pl-5 pb-4 md:pb-5">
                    Order Summary ({cartData.length}{" "}
                    {cartData.length === 1 ? "Item" : "Items"})
                </p>
            </div>
            <div className="w-full py-4 flex flex-col items-end justify-end">
                {/* Item List with Increased Scroll Height */}
                <div className="w-full h-auto overflow-y-auto px-4 md:px-5">
                    {cartData.map((cartItem) => {
                        // Get the item price (used for unit display or if totalPrice isn't reliable, though we prefer totalPrice)
                        // Get Certificate Type
                        const certificateType = cartItem.customization?.certificate?.certificateType;

                        return (
													<div
														key={cartItem.item._id}
														className="w-full flex flex-row mb-4">
														<div className="w-[25%] md:w-[27%] flex justify-end">
															<div className="w-[60px] h-[54px] md:w-[67.66px] md:h-[60px] border border-[#D2CFCF] overflow-hidden">
																<img
																	src={
																		cartItem.item.images?.[0]?.url 
																	}
																	alt={cartItem.item.name || "Product Image"}
																	width={68}
																	height={60}
																	className="w-full h-full object-cover"
																/>
															</div>
														</div>
														<div className="w-[70%] md:w-[60%] flex flex-col gap-[2px] pl-4 md:pl-6">
															<p className="text-[12px]  leading-[14px]">
																{cartItem.item.name ||
																	cartItem.item.jewelryName}
															</p>
															<p className="text-[12px] ">
																Item ID:{" "}
																<span className="text-[#7D7C7C] font-mono">
																	{cartItem.item._id?.slice(-6)}
																</span>
															</p>
															<p className="text-[12px] ">
																Qty :{" "}
																<span className="text-[#7D7C7C]">
																	{cartItem.quantity}
																</span>
															</p>

															{/* --- CHANGE 2: Display totalPrice for the line item --- */}
															<p className="text-[12px] font-semibold text-[#656363]">
																Price: {formatPrice(cartItem.totalPrice)}
															</p>
															{/* --- ADD: Display Certificate Type if available --- */}
															{certificateType && (
																<p className="text-[12px] text-[#264A3F] font-medium">
																	Certificate: {certificateType}
																</p>
															)}
														</div>
													</div>
												);
                    })}
                </div>
                {/* Total Price Section */}
                <div className="w-full mt-2 px-4 md:px-5">
                    <p className="text-[14px]  font-bold flex justify-between md:justify-around">
                        <span>Total :</span>
                        <span className="text-[16px] font-bold  text-[#656363]">
                            {/* Use the new calculateTotal function */}
                            {formatPrice(calculateTotal())}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;