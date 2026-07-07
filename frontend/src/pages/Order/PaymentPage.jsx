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
// -----------------Add By Pawan --------------------------------------------------------
import { trackPurchaseEvent, buildItemsFromCartData } from "../../utils/purchaseTracking";
// -----------------Add By Pawan -------------------------------------------------------

import "react-toastify/dist/ReactToastify.css";
import {
  useApplyOfferMutation,
  useGetUpsellingProductListQuery,
} from "../../features/api/apiSlice";
import WishlistButton from "../../components/wishlistButton";
import VideoModal from "../../components/models/VideoModal";
import { Play } from "lucide-react";

// import BlazeSDK from "../../utils/blazeCheckout";
import BlazeSDK from "@juspay/blaze-sdk-web";

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

  //-------------Add by pawan for Breeze-------
  const [breezeSubmitting, setBreezeSubmitting] = useState(false);
  //-------------Add by pawan for Breeze-------

  const normalizeAddressField = (value) => {
    if (Array.isArray(value)) {
      return value.join(" ").trim();
    }
    if (value == null) {
      return "";
    }
    return String(value).trim();
  };

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
// --------Commment by Pawan ------------------------------------
      // if (!userToken) {
      //   setLoading(false);
      //   return;
      // }

      // try {
      //   // Fetch cart data
      //   const cartResponse = await axios.get(
      //     `${URL}/cart/get_all_cart_list?page=1&limit=10`,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${userToken}`,
      //       },
      //     }
      //   );
// --------Commment by Pawan ----------------------------------------
// -----------------Add By Pawan: GA4 begin_checkout ===================================================
 console.log("[DEBUG] userToken:", userToken);

      if (!userToken) {
        console.log("[DEBUG] EXIT: no userToken");
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

        console.log("[DEBUG] cartResponse.data:", cartResponse.data);
        console.log("[DEBUG] success:", cartResponse.data?.success, "| cart:", cartResponse.data?.cart);
 // -----------------Add By Pawan: GA4 begin_checkout ===================================================
        if (cartResponse.data?.success && cartResponse.data?.cart) {
          // ✅ Normalize and store full cart data with customization
          const formattedCart = cartResponse.data.cart.map((item) => {

            const isJewelry =
              item.itemType === "Jewelry";

            return {

              productId:
                !isJewelry
                  ? (
                      item.item?.productId ||
                      item.item?._id ||
                      location.state?.productId
                    )
                  : null,

              jewelryId:
                isJewelry
                  ? item.item?._id
                  : null,

              name:
                isJewelry
                  ? item.item?.jewelryName
                  : item.item?.name,

              // IMPORTANT FIX
              price:
                isJewelry
                  ? Number(item.totalPrice || 0)
                  : Number(item.item?.price || 0),

              quantity:
                Number(item.quantity || 1),

              customization:
                item.customization || {},

              itemType:
                item.itemType || "Product",

              //-------------Add by pawan for Breeze-------
              // Breeze cart items support an image field for the checkout UI;
              // this was never populated before, so Breeze always received "undefined".
              image:
                item.item?.images?.[0]?.url ||
                item.item?.image ||
                "",
              //-------------Add by pawan for Breeze-------
            };
          });
          setCartData(formattedCart);

// ===== comment By Pawan: GA4 begin_checkout ===================================================
// window.dataLayer = window.dataLayer || [];
// window.dataLayer.push({ ecommerce: null });
// window.dataLayer.push({
//   event: "begin_checkout",
//   ecommerce: {
//     currency: "INR",
//     value: formattedCart.reduce(
//       (sum, i) => sum + Number(i.price) * Number(i.quantity || 1),
//       0
//     ),
//     items: buildItemsFromCartData(formattedCart),
//   },
// });

// (Add By Pawan) FIX — ----------------------------------------------
const beginCheckoutKey = "tracked_begin_checkout";
if (!sessionStorage.getItem(beginCheckoutKey)) {
  sessionStorage.setItem(beginCheckoutKey, "1");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "INR",
      value: formattedCart.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.quantity || 1),
        0
      ),
      items: buildItemsFromCartData(formattedCart),
    },
  });
}
// ===== End Add By Pawan ===================================================================
        }


        // Fetch user profile
        const profileResponse = await axios.get(`${URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUserProfile(profileResponse.data.user);
      } catch (err) {
        // ----------------Add And comment by  Pawan--------------
        // console.error("Error fetching data:", err);
        console.error("[DEBUG] EXIT: fetchData threw an error:", err);
        console.error("[DEBUG] err.response?.data:", err?.response?.data);
        console.error("[DEBUG] err.response?.status:", err?.response?.status);
        // ----------------Add And comment by  Pawan--------------
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [URL]);

  //console.log("cartdata", cartData);
  useEffect(() => {
    if (cartData.length === 0) {
      setPaymentTotalAmount(0);
      return;
    }

    const total = cartData.reduce((sum, item) => {

      let itemTotal =
        Number(item.price) *
        Number(item.quantity || 1);

      if (item.customization) {

        if (item.customization.goldKarat?.price)
          itemTotal += Number(item.customization.goldKarat.price);

        if (item.customization.certificate?.price)
          itemTotal += Number(item.customization.certificate.price);

        if (item.customization.gemstoneWeight?.price)
          itemTotal += Number(item.customization.gemstoneWeight.price);

        if (item.customization.quality?.price)
          itemTotal += Number(item.customization.quality.price);

        if (item.customization.diamondSubstitute?.price)
          itemTotal += Number(item.customization.diamondSubstitute.price);
      }

      return sum + itemTotal;

    }, 0);

    console.log("FINAL TOTAL =>", total);

    if (appliedDiscount === 0) {
      setPaymentTotalAmount(total);
    }

  }, [cartData, appliedDiscount]);
  
  console.log("pmethod", paymentMethod)

  // const handleCreateOrder = async () => {
  const handleCreateOrder = async (selectedPaymentMethod) => {
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

    // const orderPayload = {
    //   address,
    //   paymentMethod: paymentMethod === "online" ? "razorpay" : "cod",
    //   promoCode: promoCode || null,
    //   items: orderItems,
    // };

    const orderPayload = {
      address,
      paymentMethod: selectedPaymentMethod,
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
// Commment By Pawan -----------------------------------------------------------
  // const handleProceed = async () => {
//   const orderResult = await handleCreateOrder();
  // Comment By Pawan-----------------------------------------------------------
   // Add By Pawan-----------------------------------------------------------
   const handleShippingSubmit = () => {
  // save address so PaymentPage.jsx can read it via localStorage.getItem("shippingDetails")
  localStorage.setItem("shippingDetails", JSON.stringify({ address }));

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: "INR",
      value: totalAmount,
      shipping_tier: "Standard",
      items: buildItemsFromCartData(cartData),
    },
  });

  navigate("/payment");
};
  const handleProceed = async () => {
    // fires the moment user clicks proceed/pay — intent, not success
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "add_payment_info",
      ecommerce: {
        currency: "INR",
        value: paymentTotalAmount,
        payment_type: paymentMethod,
        items: buildItemsFromCartData(cartData),
      },
    });

    const orderResult = await handleCreateOrder();
    if (!orderResult) return;

    const { order, data } = orderResult;
    setPaymentTotalAmount(order.totalAmount);

    // fires only after order is confirmed created on backend
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "checkout_progress",
      ecommerce: {
        currency: "INR",
        value: order.totalAmount,
        payment_type: paymentMethod,
        items: buildItemsFromCartData(cartData),
      },
    });

    if (order.paymentMethod == "cod" && !order.partialPay) {
      toast.success("Order placed Successfully.");
      trackPurchaseEvent({
        orderId: order.orderId,
        subtotal: order.totalAmount,
        coupon: promoCode || "",
        items: buildItemsFromCartData(cartData),
      });
      navigate("orders/and/purchases");
      return;
    }

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
  // Add By Pawan-----------------------------------------------------------------------
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

// ===== Add By Pawan: GA4 add_payment_info ==============================================
      const handleBreezeProceed = async () => {
    //-------------Add by pawan for Breeze-------
    // Guard against double order creation from rapid double-clicks on the
    // Confirm & Proceed button while a Breeze checkout attempt is in flight.
    if (breezeSubmitting) {
      return;
    }
    setBreezeSubmitting(true);
    //-------------Add by pawan for Breeze-------

    //New Code for Breeze add by pawan
    // FIX: if the Blaze SDK callback never fires a recognized event (network
    // drop, SDK bug, user force-closes the checkout webview, etc.) the
    // button would previously stay stuck on "Processing..." forever since
    // setBreezeSubmitting(false) only ran on known success/failure paths.
    // This is a hard backstop that resets it after 60s no matter what.
    // Any real event handled below clears this timeout well before it fires.
    const breezeSafetyTimeout = setTimeout(() => {
      setBreezeSubmitting(false);
    }, 60000);
    //New Code for Breeze add by pawan

    try {
      // fires on click, before order attempt
//--------------------Add By Pawan  for Correct Amount------------------------------------------------------------- 
      const totalAmount = cartData.reduce((sum, item) => {
  let itemTotal = Number(item.price) * Number(item.quantity || 1);

  if (item.customization) {
    itemTotal += Number(item.customization.goldKarat?.price || 0);
    itemTotal += Number(item.customization.certificate?.price || 0);
    itemTotal += Number(item.customization.gemstoneWeight?.price || 0);
    itemTotal += Number(item.customization.quality?.price || 0);
    itemTotal += Number(item.customization.diamondSubstitute?.price || 0);
  }

  return sum + itemTotal;
}, 0);

// console.log("Calculated Total:", totalAmount); //this is only for debugging 
//--------------------Add By Pawan  for Correct Amount------------------------------------------------------------- 

      //comment if need by Pawan
      // This fired add_payment_info the instant the user clicked
      // "Confirm & Proceed", before the order even exists (using the
      // client-side estimated totalAmount, not the backend total).
      // Now that we listen for Breeze's real "AddPaymentInfo" SDK event
      // (fired once Breeze's own payment page has actually loaded, using
      // the confirmed backend finalAmount), keeping both would double-count
      // this GA4 event for a single checkout attempt — especially bad if
      // the user clicks Confirm but the SDK fails to load or they close it
      // before Breeze's payment page ever renders. Disabled here in favor
      // of the event-driven push inside the BlazeSDK.process callback.
      // window.dataLayer = window.dataLayer || [];
      // window.dataLayer.push({ ecommerce: null });
      // window.dataLayer.push({
      //   event: "add_payment_info",
      //   ecommerce: {
      //     currency: "INR",
      //     value: totalAmount,
      //     payment_type: "breeze",
      //     items: buildItemsFromCartData(cartData),
      //   },
      // });
      //comment if need by Pawan

      // CREATE ORDER FIRST
      const orderResult = await handleCreateOrder("breeze");

      if (!orderResult) {
        //-------------Add by pawan for Breeze-------
        //New Code for Breeze add by pawan
        clearTimeout(breezeSafetyTimeout);
        //New Code for Breeze add by pawan
        setBreezeSubmitting(false);
        //-------------Add by pawan for Breeze-------
        return;
      }

      const { order } = orderResult;

      // USE BACKEND TOTAL
      const finalAmount = Number(order.totalAmount);

      // fires once order is actually created
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "checkout_progress",
        ecommerce: {
          currency: "INR",
          value: finalAmount,
          payment_type: "breeze",
          items: buildItemsFromCartData(cartData),
        },
      });

      console.log("BACKEND FINAL:", finalAmount);
// ===== End Add By Pawan ==========================================================================

     

      if (!BlazeSDK?.process)
      {

        console.error(
          "BlazeSDK missing"
        );

        toast.error(
          "Payment SDK not loaded"
        );

        //-------------Add by pawan for Breeze-------
        //New Code for Breeze add by pawan
        clearTimeout(breezeSafetyTimeout);
        //New Code for Breeze add by pawan
        setBreezeSubmitting(false);
        //-------------Add by pawan for Breeze-------

        return;
      }

      // SHIPPING DETAILS

      //comment if need by Pawan
      // const shippingDetails =
      //   JSON.parse(
      //     localStorage.getItem(
      //       "shippingDetails"
      //     )
      //   );
      //comment if need by Pawan

      //New Code for Breeze add by pawan
      // FIX: made the "shippingDetails" key missing/null case explicit
      // instead of relying on JSON.parse(null) coercing to JSON.parse("null").
      // Behavior is the same either way, but this reads clearer and is safe
      // if localStorage.getItem ever returns something JSON.parse can't
      // handle directly.
      const shippingDetails = JSON.parse(
        localStorage.getItem("shippingDetails") || "null"
      );
      //New Code for Breeze add by pawan

      if (!shippingDetails?.address) {

        toast.error(
          "Shipping details missing"
        );

        //-------------Add by pawan for Breeze-------
        //New Code for Breeze add by pawan
        clearTimeout(breezeSafetyTimeout);
        //New Code for Breeze add by pawan
        setBreezeSubmitting(false);
        //-------------Add by pawan for Breeze-------

        return;
      }

      const cartId =
        // "cart_" + Date.now();
        order.orderId;

      const breezeCart = {

        id:
          order.orderId,

        currency:
          "INR",

        itemCount:
          cartData.reduce(
            (sum, item) =>
              sum +
              Number(item.quantity || 1),
            0
          ),

        initialPrice: Math.round(finalAmount * 100),

        totalPrice: Math.round(finalAmount * 100),

        totalDiscount: 0,

        items: cartData.map((item) => {

          let customizationTotal = 0;

          if (item.customization) {

            if (item.customization.goldKarat?.price)
              customizationTotal += Number(
                item.customization.goldKarat.price
              );

            if (item.customization.certificate?.price)
              customizationTotal += Number(
                item.customization.certificate.price
              );

            if (item.customization.gemstoneWeight?.price)
              customizationTotal += Number(
                item.customization.gemstoneWeight.price
              );

            if (item.customization.quality?.price)
              customizationTotal += Number(
                item.customization.quality.price
              );

            if (item.customization.diamondSubstitute?.price)
              customizationTotal += Number(
                item.customization.diamondSubstitute.price
              );
          }

          // DEFINE BASE PRICE
          const unitPrice =
            Number(item.price);

          // DEFINE FINAL PRICE
          const finalUnitPrice =
            unitPrice + customizationTotal;

          return {

            id:
              item.productId
                ? String(item.productId)
                : item.jewelryId
                ? String(item.jewelryId)
                : crypto.randomUUID(),

            title: item.name,

            quantity:
              Number(item.quantity || 1),

            image: item.image,

            initialPrice:
              Math.round(unitPrice * 100),

            finalPrice:
              Math.round(finalUnitPrice * 100),

            discount: 0,

          };
        }),

      };

      console.log(
        "BREEZE CART:",
        breezeCart
      );

      console.log(
        "FINAL BREEZE PAYLOAD:",
        JSON.stringify(breezeCart, null, 2)
      );

      // SIGN CART

      const response =
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/breeze/sign-cart`,
          {
            cart: breezeCart,
          }
        );

      console.log(
        "SIGN RESPONSE:",
        response.data
      );

      // PROCESS CHECKOUT
      BlazeSDK.process(

        {
          requestId: crypto.randomUUID(),

          service: "in.breeze.onecco",

          payload: {
            action: "startCheckout",

            cart: response.data.cart,

            signature: response.data.signature,

            keyId: "BHqOsoFaflqL65A4M0lcT",

            customer: {
              countryCode: "91",

              //comment if need by Pawan
              // phoneNumber: String(
              //   shippingDetails.address.mobileNo
              // ).replace(/\D/g, ""),
              //comment if need by Pawan

              //New Code for Breeze add by pawan
              // FIX: Blaze expects a bare 10-digit number (e.g. 9876543210),
              // not one still carrying a country code (e.g. 919876543210 if
              // the stored mobileNo ever includes "+91"). Stripping
              // non-digits then slicing the last 10 digits handles both
              // "+919876543210" and "9876543210" safely.
              phoneNumber: String(shippingDetails.address.mobileNo)
                .replace(/\D/g, "")
                .slice(-10),
              //New Code for Breeze add by pawan

              email: shippingDetails.address.email,

              name: shippingDetails.address.fullName,
            },

            shippingAddress: {
              postalCode:
                shippingDetails.address.pinCode,

              country: "India",

              state:
                shippingDetails.address.state,

              district:
                shippingDetails.address.district,

              city:
                shippingDetails.address.city,

              type: "Home",

              line1:
                shippingDetails.address.addressLine1,

              name:
                shippingDetails.address.fullName,

              nickname: "Home",

              phoneNumber:
                shippingDetails.address.mobileNo,

              landmark:
                shippingDetails.address.landmark ||
                "Near Area",

              countryPhoneCode: "+91",

              isDefault: true,
            },

            disableAddressSelection: false,

            hideAddress: false,

            hideOffersSection: false,

            hideUserProfile: false,

            hideTaxes: false,

            hideOffers: false,
          },
        },

        // SDK CALLBACK
        (sdkResponse) => {

          console.log(
            "BLAZE SDK EVENT:",
            sdkResponse
          );

          //-------------Add by pawan for Breeze-------
          // Log every event name the Breeze event stream sends, even ones
          // we don't explicitly handle below, so the full vocabulary of
          // events is visible in the console instead of being silently
          // dropped. Useful for confirming exact names against
          // docs.breeze.in/event-stream.
          console.log(
            "BREEZE EVENT STREAM NAME:",
            sdkResponse?.payload?.event
          );
          //-------------Add by pawan for Breeze-------

// -----------Comment By Pawan -------------------------------------------------------------
          // SUCCESS
          // if (
          //   sdkResponse?.payload?.event ===
          //   "CheckoutCompleted"
          // ) {

          //   toast.success(
          //     "Payment successful"
          //   );

          //   console.log(
          //     "PAYMENT SUCCESS"
          //   );
          //}
// -----------Comment By Pawan -------------------------------------------------------------
// ------------Add By Pawan --------------------------------------------------------------
// if (sdkResponse?.payload?.event === "purchase") {
//   toast.success("Payment successful");
//
//   // Change by Pawan: explicit GA4 purchase event fired only on confirmed payment success
//   window.dataLayer = window.dataLayer || [];
//   window.dataLayer.push({ ecommerce: null });
//   window.dataLayer.push({
//     event: "purchase",
//     ecommerce: {
//       transaction_id: order.orderId, // Change by Pawan: required for GA4 purchase event dedupe
//       currency: "INR",
//       value: order.totalAmount,
//       coupon: promoCode || "",
//       payment_type: "breeze",
//       items: buildItemsFromCartData(cartData),
//     },
//   });
//
//   trackPurchaseEvent({
//     orderId: order.orderId,
//     subtotal: order.totalAmount,
//     coupon: promoCode || "",
//     items: buildItemsFromCartData(cartData),
//   });
//
//   console.log("PAYMENT SUCCESS");
// }

// more than once for the same order).
// -----------Comment By Pawan -------------------------------------------------------------
// This block worked, but only caught 3 exact event names, never logged
// unmatched events, and never navigated the user anywhere after success —
// they were left sitting on the payment page with just a toast. Superseded
// by the "Add by pawan for Breeze" block directly below, which keeps the
// same event names plus adds a couple more, and adds the missing redirect
// + submitting-state reset.
// if (
//   sdkResponse?.payload?.event === "OrderComplete" ||
//   sdkResponse?.payload?.event === "Purchase" ||
//   sdkResponse?.payload?.event === "CheckoutCompleted"
// ) {
//   toast.success("Payment successful");
//
//   trackPurchaseEvent({
//     orderId: order.orderId,
//     subtotal: order.totalAmount,
//     coupon: promoCode || "",
//     items: buildItemsFromCartData(cartData),
//   });
//
//   console.log("PAYMENT SUCCESS");
// }
// -----------Comment By Pawan -------------------------------------------------------------

//-------------Add by pawan for Breeze-------
// comment if need by Pawan
// if (
//   sdkResponse?.payload?.event === "OrderComplete" ||
//   sdkResponse?.payload?.event === "Purchase" ||
//   sdkResponse?.payload?.event === "CheckoutCompleted"
// ) {
//   toast.success("Payment successful");
//
//   trackPurchaseEvent({
//     orderId: order.orderId,
//     subtotal: order.totalAmount,
//     coupon: promoCode || "",
//     items: buildItemsFromCartData(cartData),
//   });
//
//   console.log("PAYMENT SUCCESS");
//
//   // Redirect to order confirmation, matching what handleProceed already
//   // does for the COD/Razorpay flow — Breeze previously left the user
//   // stuck on the payment page after a successful payment.
//   navigate("orders/and/purchases");
//
//   setBreezeSubmitting(false);
// }
// comment if need by Pawan

//comment if need by Pawan
// The block below (guessed event names like "CheckoutCompleted",
// "CheckoutCancelled", "Closed", "OrderFailed", "PaymentFailed") was our
// first pass before we had the actual docs open. Verified against
// docs.breeze.in/event-stream (Event Summary table), the SDK only emits
// these 6 events — there is NO documented cancel/close/failure event:
//   AddPaymentInfo  -> Payment page loads
//   AddedAddress    -> New address saved
//   UpdatedAddress  -> Address modified
//   PayNow          -> Pay button clicked (inside Breeze UI)
//   OrderComplete   -> Order created
//   Purchase        -> Entire purchase flow is completed
// Replaced the guessed names below with these real ones. Keeping this old
// block commented for reference only — do not re-enable.
//
// const breezeSuccessEvents = [
//   "OrderComplete",
//   "OrderCompleted",
//   "Purchase",
//   "PurchaseCompleted",
//   "CheckoutCompleted",
// ];
// const breezeCancelEvents = ["CheckoutCancelled", "Cancelled"];
// const breezeClosedEvents = ["Closed", "Dismissed"];
// const breezeFailureEvents = [
//   "CheckoutFailed",
//   "OrderFailed",
//   "PaymentFailed",
// ];
//comment if need by Pawan

//New Code for Breeze add by pawan
// FIX: switched to the exact event names from docs.breeze.in/event-stream
// instead of guessed ones. Also wires real GA4 signals to the actual SDK
// milestones instead of only firing them from our own click handlers:
//   - AddPaymentInfo (Breeze's payment page actually loaded) -> GA4 add_payment_info
//   - AddedAddress / UpdatedAddress (address saved inside Breeze) -> GA4 add_shipping_info
//   - Purchase (whole flow completed) -> GA4 purchase + trackPurchaseEvent + redirect
// NOTE: the docs table has no cancel/failure event. If the user backs out
// of the Breeze sheet without completing, no event may fire at all here —
// that's why the 60s breezeSafetyTimeout above still exists, to reset the
// button in that case. Confirm with Breeze support whether an
// undocumented event fires on abandonment; until then this is a known gap,
// not something to paper over with guessed event names.
const breezeEvent = sdkResponse?.payload?.event;

if (breezeEvent === "AddPaymentInfo") {
  // Breeze's own payment page has loaded inside the SDK sheet.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "add_payment_info",
    ecommerce: {
      currency: "INR",
      value: finalAmount,
      payment_type: "breeze",
      items: buildItemsFromCartData(cartData),
    },
  });

  console.log("BREEZE: AddPaymentInfo");
}

if (breezeEvent === "AddedAddress" || breezeEvent === "UpdatedAddress") {
  // User added or changed a shipping address from inside the Breeze sheet.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: "INR",
      value: finalAmount,
      shipping_tier: "Standard",
      items: buildItemsFromCartData(cartData),
    },
  });

  console.log("BREEZE:", breezeEvent);
}

if (breezeEvent === "PayNow") {
  // User clicked "Pay Now" inside the Breeze sheet — informational only,
  // no GA4 event mapped to this one.
  console.log("BREEZE: PayNow clicked");
}

if (breezeEvent === "OrderComplete") {
  // Order has been created on Breeze's side. Mirrors the checkout_progress
  // signal handleProceed already fires for the COD/Razorpay flow.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "checkout_progress",
    ecommerce: {
      currency: "INR",
      value: finalAmount,
      payment_type: "breeze",
      items: buildItemsFromCartData(cartData),
    },
  });

  console.log("BREEZE: OrderComplete");
}

if (breezeEvent === "Purchase") {
  // Entire purchase flow is completed — this is the real success signal.
  toast.success("Payment successful");

  // FIX: guard against firing GA4 purchase tracking twice if this event
  // is ever delivered more than once for the same order.
  const purchaseKey = `tracked_purchase_${order.orderId}`;
  if (!sessionStorage.getItem(purchaseKey)) {
    sessionStorage.setItem(purchaseKey, "1");

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: order.orderId,
        currency: "INR",
        value: order.totalAmount,
        coupon: promoCode || "",
        payment_type: "breeze",
        items: buildItemsFromCartData(cartData),
      },
    });

    trackPurchaseEvent({
      orderId: order.orderId,
      subtotal: order.totalAmount,
      coupon: promoCode || "",
      items: buildItemsFromCartData(cartData),
    });
  }

  console.log("PAYMENT SUCCESS");

  // Redirect to order confirmation, matching what handleProceed already
  // does for the COD/Razorpay flow — Breeze previously left the user
  // stuck on the payment page after a successful payment.
  navigate("orders/and/purchases");

  clearTimeout(breezeSafetyTimeout);
  setBreezeSubmitting(false);
}
//New Code for Breeze add by pawan
//-------------Add by pawan for Breeze-------
// ------------Add By Pawan ---------------------------------------------------------------


          // FAILURE
// -----------Comment By Pawan -------------------------------------------------------------
// Only matched "CheckoutFailed". This event is NOT in the documented
// Event Summary table (docs.breeze.in/event-stream only lists
// AddPaymentInfo, AddedAddress, UpdatedAddress, PayNow, OrderComplete,
// Purchase). Leaving this fully commented out rather than guessing —
// re-enable only if Breeze support confirms a real failure event name.
          // if (
          //   sdkResponse?.payload?.event ===
          //   "CheckoutFailed"
          // ) {

          //   toast.error(
          //     "Payment failed"
          //   );

          //   console.log(
          //     "PAYMENT FAILED"
          //   );
          // }
// -----------Comment By Pawan -------------------------------------------------------------

          //comment if need by Pawan
          // if (
          //   sdkResponse?.payload?.event === "CheckoutFailed" ||
          //   sdkResponse?.payload?.event === "OrderFailed" ||
          //   sdkResponse?.payload?.event === "PaymentFailed"
          // ) {

          //   toast.error(
          //     "Payment failed"
          //   );

          //   console.log(
          //     "PAYMENT FAILED"
          //   );

          //   setBreezeSubmitting(false);
          // }
          // comment if need by Pawan
        }
      );

    }
    catch (err) 
    {

        console.error(
          "BREEZE CHECKOUT ERROR:",
          err
        );

        console.error(
          "BREEZE ERROR RESPONSE:",
          err?.response?.data
        );

        console.error(
          "BREEZE ERROR MESSAGE:",
          err?.message
        );

        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          "Checkout failed"
        );

        //-------------Add by pawan for Breeze-------
        //New Code for Breeze add by pawan
        clearTimeout(breezeSafetyTimeout);
        //New Code for Breeze add by pawan
        setBreezeSubmitting(false);
        //-------------Add by pawan for Breeze-------
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
              {/* <div className="w-full h-auto lg:h-[90px] mb-4">
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
              </div> */}

              {/* <div className="text-2xl font-semibold text-[#264A3F] mb-4">
                Payment Options
              </div> */}

              {/* Online Payment */}
              {/* <div
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
              </div> */}

              {/*COD */}
              {/* <div
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
              </div> */}
              
              {/* <span className="text-sm text-red-500 mt-2">
                Note: If Product is above 5000 and below 20000 Rs then 10%
                online payment you have to complete(for COD)
              </span> */}

              {/* Button */}
              <div className="w-full h-auto flex items-end mt-6">
                <button
                  // onClick={handleProceed}
                  onClick={handleBreezeProceed}
                  //-------------Add by pawan for Breeze----------------------------
                  disabled={breezeSubmitting}
                  className="w-full max-w-[458px] h-[60px] text-[20px] font-serif text-white bg-[#264A3F] rounded-[10px] cursor-pointer"
                >
                  {paymentMethod === "cod"
                    ? "Place Order with Cash on Delivery"
                    :
                      //-------------Add by pawan for Breeze-------
                      (breezeSubmitting ? "Processing..." : "Confirm & Proceed")
                      //-------------Add by pawan for Breeze-------
                    }
                    {/* Confirm */}
                </button>
              </div>
              {/* */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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

                      <img
                        src={product?.images?.[0]?.url}
                        alt={product?.name}
                        className="w-full h-32 sm:h-40 object-contain mb-2"
                      />

                      <h2 className="text-sm font-semibold text-[#0B1D3A] text-center line-clamp-2">
                        {product?.name}
                      </h2>

                      <p className="text-xs text-gray-500 text-center mt-1">
                        Origin: {product?.origin || "Unknown"}
                      </p>

                      <p className="text-center text-sm text-black font-bold mt-2">
                        Rs.{product.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  ))
                )}

                <VideoModal
                  isOpen={showModal}
                  onClose={() => {
                    setShowModal(false);
                    setSelectedVideo(null);
                  }}
                  videoUrl={selectedVideo}
                />
              </div> */}
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