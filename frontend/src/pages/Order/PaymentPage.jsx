"use client";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderSummary from "./OrderSummary";
import ShoppingMap from "./ShoppingMap";
import UPI from "../../assets/Payment/UPI.svg";
import Netbanking from "../../assets/Payment/Netbanking.svg";
import creditAndDebit from "../../assets/Payment/creditAndDebit.svg";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeItemFromCart } from "../../redux/cartSlice";

import "react-toastify/dist/ReactToastify.css";
import {
  useApplyOfferMutation,
  useGetUpsellingProductListQuery,
} from "../../features/api/apiSlice";
import WishlistButton from "../../components/wishlistButton";
import VideoModal from "../../components/models/VideoModal";
import { Play } from "lucide-react";

const products = [
  {
    _id: "671a3fbc123abc01",
    name: "Blue Sapphire (Neelam)",
    slug: "blue-sapphire-premium",
    origin: "Sri Lanka",
    price: 18500,
    images: [{ url: "https://example.com/images/sapphire1.png" }],
    videos: [{ url: "https://example.com/videos/sapphire1.mp4" }],
  },
  {
    _id: "671a3fbc123abc02",
    name: "Ruby (Manik)",
    slug: "ruby-natural-certified",
    origin: "Myanmar",
    price: 21500,
    images: [{ url: "https://example.com/images/ruby1.png" }],
    videos: [],
  },
  {
    _id: "671a3fbc123abc03",
    name: "Emerald (Panna)",
    slug: "emerald-natural",
    origin: "Colombia",
    price: 9500,
    images: [{ url: "https://example.com/images/emerald1.png" }],
    videos: [{ url: "https://example.com/videos/emerald1.mp4" }],
  },
  {
    _id: "671a3fbc123abc04",
    name: "Yellow Sapphire (Pukhraj)",
    slug: "yellow-sapphire-certified",
    origin: "Thailand",
    price: 12000,
    images: [{ url: "https://example.com/images/yellow-sapphire.png" }],
    videos: [],
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_URL;
  const dispatch = useDispatch();
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const selectedOfferId = null;
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [paymentTotalAmount, setPaymentTotalAmount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  const normalizeAddressField = (value) => {
    if (Array.isArray(value)) {
      return value.join(" ").trim();
    }
    if (value == null) {
      return "";
    }
    return String(value).trim();
  };

  // console.log("id", location.state?.productId); // works

  // console.log("cartdata", cartData);

  const { data: upSellingProducts } = useGetUpsellingProductListQuery();

  useEffect(() => {
    const fetchData = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      let userToken = null;

      if (userInfoString) {
        try {
          const userInfo = JSON.parse(userInfoString);
          userToken = userInfo.token;
        } catch (e) {
          console.error("Failed to parse userInfo", e);
        }
      }

      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        // Fetch cart data
        const cartResponse = await axios.get(
          `${URL}/cart/get_all_cart_list?page=1&limit=10`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (cartResponse.data?.success && cartResponse.data?.cart) {
          // ✅ Normalize and store full cart data with customization
          const formattedCart = cartResponse.data.cart.map((item) => {
            return {
              productId: item.item?.productId ?? location.state?.productId,
              jewelryId: item.item?.jewelryId || null,
              name: item.item?.name || "Unnamed Item",
              price: item.item?.price || 0,
              quantity: item.quantity || 1,
              customization: item.item?.customization || {},
            };
          });
          setCartData(formattedCart);
        }

        // Fetch user profile
        const profileResponse = await axios.get(`${URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUserProfile(profileResponse.data.user);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [URL]);

  // const calculateTotal = () => {
  //   return cartData.reduce((total, item) => {
  //     let itemTotal = item.price * item.quantity;

  //     // Add customization costs (if any)
  //     if (item.customization) {
  //       if (item.customization.goldKarat?.price)
  //         itemTotal += item.customization.goldKarat.price;
  //       if (item.customization.certificate?.price)
  //         itemTotal += item.customization.certificate.price;
  //       if (item.customization.gemstoneWeight?.price)
  //         itemTotal += item.customization.gemstoneWeight.price;
  //       if (item.customization.quality?.price)
  //         itemTotal += item.customization.quality.price;
  //       if (item.customization.diamondSubstitute?.price)
  //         itemTotal += item.customization.diamondSubstitute.price;
  //     }

  //     return total + itemTotal;
  //   }, 0);
  //   // ✅ PAYMENT TOTAL (rules only)
  //   setPaymentTotalAmount(calculateTotal);
  // };

  //console.log("cartdata", cartData);
  useEffect(() => {
    if (cartData.length === 0) {
      setPaymentTotalAmount(0);
      return;
    }

    const total = cartData.reduce((sum, item) => {
      let itemTotal = item.price * item.quantity;

      if (item.customization) {
        if (item.customization.goldKarat?.price)
          itemTotal += item.customization.goldKarat.price;
        if (item.customization.certificate?.price)
          itemTotal += item.customization.certificate.price;
        if (item.customization.gemstoneWeight?.price)
          itemTotal += item.customization.gemstoneWeight.price;
        if (item.customization.quality?.price)
          itemTotal += item.customization.quality.price;
        if (item.customization.diamondSubstitute?.price)
          itemTotal += item.customization.diamondSubstitute.price;
      }

      return sum + itemTotal;
    }, 0);

    if (appliedDiscount === 0) {
      setPaymentTotalAmount(total);
    }
  }, [cartData, appliedDiscount]);

  console.log("pmethod", paymentMethod)

  const handleCreateOrder = async () => {
    const userInfoString = localStorage.getItem("userInfo");
    const storedShippingDetails = localStorage.getItem("shippingDetails");

    if (!userInfoString) {
      alert("Please log in first.");
      navigate("/login");
      return null;
    }

    if (cartData.length === 0) {
      alert("Your cart is empty.");
      return null;
    }

    const userInfo = JSON.parse(userInfoString);
    const shippingDetails = storedShippingDetails ? JSON.parse(storedShippingDetails) : null;

    // Get address from shippingDetails or userProfile
    const addressData = shippingDetails?.address || userProfile?.address;

    if (!addressData) {
      alert("Please complete shipping details first.");
      navigate("/shipping/address");
      return null;
    }

    let address = {};
    if (Array.isArray(addressData)) {
      // Assume first address if array
      const addr = addressData[0] || {};
      address = {
        fullName: normalizeAddressField(addr.fullName || userInfo.name || ""),
        email: normalizeAddressField(addr.email || userInfo.email || ""),
        mobileNo: normalizeAddressField(addr.mobileNo || userInfo.mobileNo || ""),
        addressLine1: normalizeAddressField(addr.addressLine1 || ""),
        addressLine2: normalizeAddressField(addr.addressLine2 || ""),
        landmark: normalizeAddressField(addr.landmark || ""),
        city: normalizeAddressField(addr.city || ""),
        district: normalizeAddressField(addr.district || ""),
        state: normalizeAddressField(addr.state || ""),
        pinCode: normalizeAddressField(addr.pinCode || ""),
        country: normalizeAddressField(addr.country || "India"),
        addressType: normalizeAddressField(addr.addressType || "Home"),
        note: normalizeAddressField(addr.note || ""),
      };
    } else {
      address = {
        fullName: normalizeAddressField(addressData.fullName || userInfo.name || ""),
        email: normalizeAddressField(addressData.email || userInfo.email || ""),
        mobileNo: normalizeAddressField(addressData.mobileNo || userInfo.mobileNo || ""),
        addressLine1: normalizeAddressField(addressData.addressLine1 || ""),
        addressLine2: normalizeAddressField(addressData.addressLine2 || ""),
        landmark: normalizeAddressField(addressData.landmark || ""),
        city: normalizeAddressField(addressData.city || ""),
        district: normalizeAddressField(addressData.district || ""),
        state: normalizeAddressField(addressData.state || ""),
        pinCode: normalizeAddressField(addressData.pinCode || ""),
        country: normalizeAddressField(addressData.country || "India"),
        addressType: normalizeAddressField(addressData.addressType || "Home"),
        note: normalizeAddressField(addressData.note || ""),
      };
    }

    // console.log("✅ Final Address Payload:", address);
    // console.log("✅ Cart Data for Order:", cartData);

    // ✅ Build order items
    const orderItems = cartData.map((item) => {
      let itemTotal = item.price * item.quantity;

      if (item.customization) {
        if (item.customization.goldKarat?.price)
          itemTotal += item.customization.goldKarat.price;
        if (item.customization.certificate?.price)
          itemTotal += item.customization.certificate.price;
        if (item.customization.gemstoneWeight?.price)
          itemTotal += item.customization.gemstoneWeight.price;
        if (item.customization.quality?.price)
          itemTotal += item.customization.quality.price;
        if (item.customization.diamondSubstitute?.price)
          itemTotal += item.customization.diamondSubstitute.price;
      }

      return {
        productId: item.productId ?? location.state?.productId,
        jewelryId: item.jewelryId || undefined,
        quantity: item.quantity,
        itemTotal,
        customization: item.customization || {},
      };
    });

    const orderPayload = {
      address,
      paymentMethod: paymentMethod === "online" ? "razorpay" : "cod",
      promoCode: promoCode || null,
      items: orderItems,
    };

    // console.log("📦 Sending Order Payload:", orderPayload);

    try {
      const response = await axios.post(
        `${URL}/order/create-order`,
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.data?.order) {
        sessionStorage.removeItem("shippingDetails");
        toast.success("Order created successfully!");
        return response.data;
      } else {
        toast.error(
          response.data.message ||
          response.data.msg ||
          "Failed to create order. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "An error occurred while creating the order. Please try again."
      );
      return null;
    }
  };
  console.log("totl", paymentTotalAmount)

  const handleProceed = async () => {
    const orderResult = await handleCreateOrder();
    if (!orderResult) return;

    const { order, data } = orderResult;
    // Update paymentTotalAmount with backend calculated total
    setPaymentTotalAmount(order.totalAmount);

    // case  01 -> no razorpay pure COD
    if (order.paymentMethod == "cod" && !order.partialPay) {
      toast.success("Order placed Successfully.");
      navigate("orders/and/purchases");
      return;
    }

    // case 02 -> partial payment or full razorpay
    navigate("/use-razorpay", {
      state: {
        order,
        razorpay: {
          orderId: data.id,
          amount: data.amount,
          currency: data.currency || "INR",
        },
      },
    });
  };

  const [promoCode, setPromoCode] = useState("");
  const [totalDiscountApplied, setTotalDiscountApplied] = useState(0);

  const [applyOffer] = useApplyOfferMutation();

  /////////////////////////////////////////////////////////
  const handleCODSelect = () => {
    setPaymentMethod("cod");
  };

  ///////////////////////////////////////////////////////////

  const handleOfferApply = async (promoCode) => {
    try {
      const res = await applyOffer(promoCode).unwrap();
      setTotalDiscountApplied(res.cartSummary.totalDiscount);
      setAppliedDiscount(res.cartSummary.totalDiscount);
      setPaymentTotalAmount(res.cartSummary.finalTotal);
      toast.success("Offer applied successfully!");
    } catch (error) {
      toast.error(
        error?.data?.message ||
        error?.data?.msg ||
        error?.error ||
        "Failed to apply offer. Please try again."
      );
      setPromoCode("");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen lg:min-h-[1070px] flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full lg:border-r border-[#D2CFCF] lg:pt-10">
          <ShoppingMap activeStep={3} />
          <div className="w-full flex px-4 md:px-6 lg:px-30">
            <div className="w-full h-auto flex flex-col justify-end">
              <div className="w-full h-auto lg:h-[90px] mb-4">
                <div>
                  <label
                    htmlFor="couponCode"
                    className="block text-md font-medium text-gray-700 mb-2"
                  >
                    Apply coupon code here (if any)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="couponCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />

                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition"
                      onClick={() => handleOfferApply(promoCode)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-4 mt-2">
                  Total discount applied:{" "}
                  <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">
                    Rs. {totalDiscountApplied}
                  </span>
                </p>
              </div>

              <div className="text-2xl font-semibold text-[#264A3F] mb-4">
                Payment Options
              </div>

              {/* Online Payment */}
              <div
                className={`w-full rounded-[10px] flex flex-col justify-center p-4 cursor-pointer
                        ${paymentMethod === "online"
                    ? "border-2 border-[#0EC78E]"
                    : "border border-[#AEABAB]"
                  }`}
                onClick={() => setPaymentMethod("online")}
              >
                <div className="flex items-center gap-4 lg:pl-4">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="w-[25px] h-[25px] accent-[#264A3F]"
                  />
                  <p className="text-[20px] lg:text-[24px] font-serif text-[#264A3F]">
                    Online Payment
                  </p>
                </div>
                <div className="flex flex-col gap-3 pl-8 pt-4">
                  <div className="flex items-center gap-3">
                    <img src={UPI} alt="UPI" className="w-[30px] h-[24px]" />
                    <p className="text-[14px] font-serif text-[#264A3F] font-bold">
                      UPI
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={Netbanking}
                      alt="Netbanking"
                      className="w-[35px] h-[35px]"
                    />
                    <p className="text-[14px] font-serif text-[#264A3F] font-bold">
                      Netbanking
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={creditAndDebit}
                      alt="Cards"
                      className="w-[35px] h-[35px]"
                    />
                    <p className="text-[14px] font-serif text-[#264A3F] font-bold">
                      Credit & Debit Card
                    </p>
                  </div>
                </div>
              </div>

              {/*COD */}
              <div
                type="radio"
                name="payment"
                value="cod"
                className={`w-full h-auto rounded-[10px] flex items-center p-4 mt-8 cursor-pointer"
                  }`}
                onClick={() => handleCODSelect()}
              >
                <div className="flex items-center gap-4 lg:pl-4">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    // checked={paymentMethod === "cod"}
                    onChange={() => handleCODSelect()}
                    // => setPaymentMethod("cod")} // if 5k -totalamount  20k  paymnet - razorpay
                    className="w-[25px] h-[25px] accent-[#264A3F] cursor-pointer"
                  />
                  <p className="text-[20px] lg:text-[24px] text-[#264A3F] font-serif"

                  >
                    Cash on Delivery
                  </p>
                </div>
              </div>
              <span className="text-sm text-red-500 mt-2">
                Note: If Product is above 5000 and below 20000 Rs then 10%
                online payment you have to complete(for COD)
              </span>

              {/* Button */}
              <div className="w-full h-auto flex items-end mt-6">
                <button
                  onClick={handleProceed}
                  className="w-full max-w-[458px] h-[60px] text-[20px] font-serif text-white bg-[#264A3F] rounded-[10px] cursor-pointer"
                >
                  {paymentMethod === "cod"
                    ? "Place Order with Cash on Delivery"
                    : "Confirm & Proceed"}
                </button>
              </div>
              {/* */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {upSellingProducts?.products.length === 0 ? (
                  <p className="text-gray-500 text-sm col-span-full text-center">
                    No products found.
                  </p>
                ) : (
                  upSellingProducts?.products?.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white shadow-md rounded-xl p-4 relative cursor-pointer hover:shadow-lg transition"
                      onClick={() => {
                        const { appendRandomString } = require("../../utils/randomString");
                        navigate(appendRandomString(`/gemstones/${product.slug}`));
                      }}
                    >
                      {/* Wishlist + video buttons */}
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <WishlistButton
                          itemId={product._id}
                          itemType="Product"
                        />

                        {product.videos?.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstVideo =
                                typeof product.videos[0] === "string"
                                  ? product.videos[0]
                                  : product.videos[0]?.url;

                              setSelectedVideo(firstVideo);
                              setShowModal(true);
                            }}
                            className="p-1 border rounded-full bg-white hover:bg-gray-100 transition"
                          >
                            <Play className="w-4 h-4 text-gray-700" />
                          </button>
                        )}
                      </div>

                      {/* Product Image */}
                      <img
                        src={product?.images?.[0]?.url}
                        alt={product?.name}
                        className="w-full h-32 sm:h-40 object-contain mb-2"
                      />

                      {/* Name */}
                      <h2 className="text-sm font-semibold text-[#0B1D3A] text-center line-clamp-2">
                        {product?.name}
                      </h2>

                      {/* Origin */}
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Origin: {product?.origin || "Unknown"}
                      </p>

                      {/* Price */}
                      <p className="text-center text-sm text-black font-bold mt-2">
                        Rs.{product.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  ))
                )}

                {/* Video Modal */}
                <VideoModal
                  isOpen={showModal}
                  onClose={() => {
                    setShowModal(false);
                    setSelectedVideo(null);
                  }}
                  videoUrl={selectedVideo}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <OrderSummary />
      </div>
    </>
  );
}

export default PaymentPage;
