"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BlueSapphire from "../../assets/Stone/BlueSapphire.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, removeItemFromCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { appendRandomString } from "../../utils/randomString";
import BlazeSDK from "@juspay/blaze-sdk-web";
// ----------Add by Pawan for GA4 Tracking----------------
import { trackPurchaseEvent, buildItemsFromCartData } from "../../utils/purchaseTracking";
// -------Add by Pawan for GA4 Tracking----------------

//Add by pawan----------------------------------------------------------------
// buildItemsFromCartData (from utils/purchaseTracking.js) expects a FLAT shape
// (item.productId, item.jewelryId, item.name, item.price) that only exists in
// PaymentPage.jsx's normalized cart. Here, cartData is the RAW API response —
// product/jewelry data is nested under item.item, price is item.totalPrice.
// This mirrors the exact mapping already used (and proven correct) for view_cart.
function buildBreezeItemsFromRawCart(cartData = []) {
  return cartData.map((ci) => {
    const isJewelry = ci.itemType === "Jewelry";
    const hasJewelryCustomization = !!ci.customization?.jewelryId;
    const name = isJewelry
      ? ci.item?.jewelryName
      : hasJewelryCustomization
      ? ci.customization.jewelryId?.jewelryName
      : ci.item?.name;
    const qty = Number(ci.quantity) || 1;
    const variant =
      ci.customization?.quality?.name ||
      ci.customization?.goldKarat?.name ||
      ci.customization?.certificate?.name ||
      "";
    return {
      item_id: String(ci.item?._id || ci._id || ""),
      item_name: name || "Unnamed Item",
      item_brand: "Gemrishi",
      item_category: ci.itemType || "",
      item_variant: variant,
      price: qty ? Number((ci.totalPrice / qty).toFixed(2)) : Number(ci.totalPrice) || 0,
      quantity: qty,
    };
  });
}
//Add by pawan----------------------------------------------------------------

// --- Premium Skeleton Loader (Mobile Optimized) ---
const CartItemSkeleton = () => (
  <div className="w-full bg-white rounded-[20px] sm:rounded-[24px] border border-gray-200 shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6 animate-pulse mb-4 sm:mb-6">
    <div className="w-[85px] h-[85px] sm:w-[140px] sm:h-[140px] rounded-[12px] sm:rounded-[16px] bg-gray-100 flex-shrink-0"></div>
    <div className="flex-1 flex flex-col py-1">
      <div className="flex justify-between items-start gap-2">
        <div className="h-5 sm:h-6 w-3/4 sm:w-2/3 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-5 bg-gray-200 rounded-md flex-shrink-0"></div>
      </div>
      <div className="h-3 sm:h-4 w-1/3 bg-gray-100 rounded-md mt-3"></div>
      <div className="h-3 sm:h-4 w-1/4 bg-gray-100 rounded-md mt-2"></div>
      <div className="mt-auto pt-4">
        <div className="h-5 sm:h-7 w-20 sm:w-28 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  </div>
);

// --- UpSelling Component (Mobile Optimized) ---
function UpSellingProducts({ products = [], loading = false }) {
  const navigate = useNavigate();

  if (loading) return <div className="mt-8 text-gray-400 text-center animate-pulse text-sm">Curating suggestions...</div>;

  if (!products.length) return null;

  return (
    <div className="mt-12 sm:mt-16 mb-20">
      <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-6 border-b border-gray-200 pb-3">You may also desire</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {products.slice(0, 4).map((p) => {
          const isJewelry = !p.jewelryName;
          const name = isJewelry ? p.slug : p.name;
          const slug = p.slug;
          const route = !isJewelry ? appendRandomString(`/details/product/${slug}`) : appendRandomString(`/gemstones/${slug}`);

          return (
            <div
              key={p._id}
              className="group cursor-pointer bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 sm:mb-4 border border-gray-100 flex items-center justify-center p-3">
                <img
                  src={p.images?.[0]?.url || BlueSapphire}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  alt={name}
                />
              </div>
              <p className="text-[13px] sm:text-[15px] font-medium text-gray-800 line-clamp-1 px-1">{name}</p>
              <p className="text-[11px] sm:text-[13px] text-gray-500 mt-0.5 sm:mt-1 uppercase tracking-wider px-1 pb-1">Discover</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Cart Component ---
function ShoppingCart() {
  const [cartData, setCartData] = useState([]);

  const [userProfile, setUserProfile] = useState(null);
  const [promoCode, setPromoCode] = useState("");
// -----------------comment By Pawan --------------------------------------------------------------
const hasTrackedViewCart = useRef(false);
// -------------------------------------------------------------------------------------------------
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_URL;
  const dispatch = useDispatch();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [upsellLoading, setUpsellLoading] = useState(true);
  const userInfo = useSelector((state) => state.auth.userInfo);
  // Formatting helper
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // --- UPSELL LOGIC ---
  useEffect(() => {
    let mounted = true;
    const buildSkusFromCart = (cart) => {
      if (!Array.isArray(cart) || cart.length === 0) return [];
      return { id: cart[0].item?._id };
    };

    const fetchUpsellForSkus = async (skus) => {
      if (!mounted) return;
      if (!skus || skus.length === 0) {
        if (mounted) {
          setProducts([]);
          setUpsellLoading(false);
        }
        return;
      }

      try {
        if (mounted) setUpsellLoading(true);
        const res = await axios.get(
          `${URL}/product/upselling-product-list/${skus.id}`,
          { withCredentials: true },
        );
        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (Array.isArray(res.data?.products)) data = res.data.products;
        else if (Array.isArray(res.data?.data)) data = res.data.data;
        else if (res.data && typeof res.data === "object" && res.data._id)
          data = [res.data];

        if (mounted) setProducts(data);
      } catch (err) {
        console.error("Upsell fetch error:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setUpsellLoading(false);
      }
    };

    (async () => {
      const skus = buildSkusFromCart(cartData);
      if (!skus || !skus.id) {
        if (mounted) setUpsellLoading(false);
        return;
      }
      await fetchUpsellForSkus(skus);
    })();

    return () => {
      mounted = false;
    };
  }, [URL, cartData]);

  const initialCartCount = cartData?.length || 1;

  // --- FETCH CART ITEMS ---
  const fetchCartItems = async () => {
    const userInfoString = localStorage.getItem("userInfo");
    let userToken = null;

    if (userInfoString) {
      try {
        userToken = JSON.parse(userInfoString).token;
      } catch (e) {
        console.error("Failed to parse userInfo", e);
      }
    }

    try {
      setLoading(true);
      setError(null);

      const headers = { "Content-Type": "application/json" };
      if (userToken) headers.Authorization = `Bearer ${userToken}`;

      const response = await axios.get(
        `${URL}/cart/get_all_cart_list?page=1&limit=10`,
        { headers, withCredentials: true }
      );

      if (response.data?.success && response.data?.cart) {
        setCartData(response.data.cart);
        dispatch(setCartItems(response.data.cart));

        if (!hasTrackedViewCart.current && response.data.cart.length > 0) {
          hasTrackedViewCart.current = true;

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: "view_cart",
            ecommerce: {
              currency: "INR",
              value: response.data.cart.reduce(
                (sum, ci) => sum + (Number(ci.totalPrice) || 0),
                0
              ),
              items: response.data.cart.map((ci) => {
                const isJewelry = ci.itemType === "Jewelry";
                const hasJewelryCustomization = !!ci.customization?.jewelryId;
                const name = isJewelry
                  ? ci.item?.jewelryName
                  : hasJewelryCustomization
                  ? ci.customization.jewelryId?.jewelryName
                  : ci.item?.name;
                const qty = Number(ci.quantity) || 1;
                return {
                  item_id: String(ci.item?._id || ci._id || ""),
                  item_name: name || "Unnamed Item",
                  item_brand: "Gemrishi",
                  item_category: ci.itemType || "",
                  price: qty ? Number((ci.totalPrice / qty).toFixed(2)) : Number(ci.totalPrice) || 0,
                  quantity: qty,
                };
              }),
            },
          });
        }
      } else {
        setCartData([]);
        dispatch(setCartItems([]));
      }
    } catch (err) {
      console.error("Error fetching cart items:", err);
      if (err.response?.status === 401) {
        setError("Please log in to view your cart items.");
      } else if (err.response?.data?.message) {
        setError(`Failed to retrieve cart: ${err.response.data.message}`);
      } else {
        setError("We are facing a temporary connection issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- REMOVE ITEM ---
  const handleRemoveItem = async (cartItemId) => {
    const userInfoString = localStorage.getItem("userInfo");
    let userToken = null;

    if (userInfoString) {
      try {
        userToken = JSON.parse(userInfoString).token;
      } catch (e) { }
    }

    //Add by pawan----------------------------------------------------------------
    // capture the item BEFORE it's removed from cartData, so we still
    // have its name/price/qty to send to GA4
    const removedItem = cartData.find((ci) => ci._id === cartItemId);
    //Add by pawan----------------------------------------------------------------

    // Optional: Optimistic UI update could go here
    setLoading(true);

    try {
      const headers = {};
      if (userToken) headers.Authorization = `Bearer ${userToken}`;

      await axios.delete(
        `${URL}/cart/remove_item_from_cart?cartItemId=${cartItemId}`,
        { headers, withCredentials: true }
      );

      //Add by pawan----------------------------------------------------------------
      if (removedItem) {
        const isJewelry = removedItem.itemType === "Jewelry";
        const hasJewelryCustomization = !!removedItem.customization?.jewelryId;
        const name = isJewelry
          ? removedItem.item?.jewelryName
          : hasJewelryCustomization
          ? removedItem.customization.jewelryId?.jewelryName
          : removedItem.item?.name;
        const qty = Number(removedItem.quantity) || 1;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "remove_from_cart",
          ecommerce: {
            currency: "INR",
            value: Number(removedItem.totalPrice) || 0,
            items: [
              {
                item_id: String(removedItem.item?._id || removedItem._id || ""),
                item_name: name || "Unnamed Item",
                item_brand: "Gemrishi",
                item_category: removedItem.itemType || "",
                price: qty ? Number((removedItem.totalPrice / qty).toFixed(2)) : Number(removedItem.totalPrice) || 0,
                quantity: qty,
              },
            ],
          },
        });
      }
      //Add by pawan----------------------------------------------------------------

      dispatch(removeItemFromCart(cartItemId));
      await fetchCartItems();
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
      toast.error("Failed to remove item. Please try again.", { position: "top-center" });
      await fetchCartItems();
    }
  };

  // --- PROCEED TO CHECKOUT ---
  const handleProceedToCheckout = () => {
    const userInfoString = localStorage.getItem("userInfo");
    let userToken = null;

    if (userInfoString) {
      try {
        userToken = JSON.parse(userInfoString).token;
      } catch (e) { }
    }

    if (userToken) {
      navigate("/shipping/address", { state: { productId: location?.state?.productId } });
    } else {
      toast.info("Please Login to Checkout", { position: "top-center", autoClose: 3000 });
    }
  };


  const handleCreateOrder = async (selectedPaymentMethod) => {
    // const userInfoString = localStorage.getItem("userInfo");
    // const storedShippingDetails = localStorage.getItem("shippingDetails");

    // if (!userInfoString) {
    //   alert("Please log in first.");
    //   navigate("/login");
    //   return null;
    // }

    if (cartData.length === 0) {
      alert("Your cart is empty.");
      return null;
    }

    // const userInfo = JSON.parse(userInfoString);
    // const shippingDetails = storedShippingDetails ? JSON.parse(storedShippingDetails) : null;

    // Get address from shippingDetails or userProfile
    // const addressData = shippingDetails?.address || userProfile?.address;

    // if (!addressData) {
    //   alert("Please complete shipping details first.");
    //   navigate("/shipping/address");
    //   return null;
    // }

    // let address = {};
    // if (Array.isArray(addressData)) {
    //   // Assume first address if array
    //   const addr = addressData[0] || {};
    //   address = {
    //     fullName: normalizeAddressField(addr.fullName || userInfo.name || ""),
    //     email: normalizeAddressField(addr.email || userInfo.email || ""),
    //     mobileNo: normalizeAddressField(addr.mobileNo || userInfo.mobileNo || ""),
    //     addressLine1: normalizeAddressField(addr.addressLine1 || ""),
    //     addressLine2: normalizeAddressField(addr.addressLine2 || ""),
    //     landmark: normalizeAddressField(addr.landmark || ""),
    //     city: normalizeAddressField(addr.city || ""),
    //     district: normalizeAddressField(addr.district || ""),
    //     state: normalizeAddressField(addr.state || ""),
    //     pinCode: normalizeAddressField(addr.pinCode || ""),
    //     country: normalizeAddressField(addr.country || "India"),
    //     addressType: normalizeAddressField(addr.addressType || "Home"),
    //     note: normalizeAddressField(addr.note || ""),
    //   };
    // } else {
    //   address = {
    //     fullName: normalizeAddressField(addressData.fullName || userInfo.name || ""),
    //     email: normalizeAddressField(addressData.email || userInfo.email || ""),
    //     mobileNo: normalizeAddressField(addressData.mobileNo || userInfo.mobileNo || ""),
    //     addressLine1: normalizeAddressField(addressData.addressLine1 || ""),
    //     addressLine2: normalizeAddressField(addressData.addressLine2 || ""),
    //     landmark: normalizeAddressField(addressData.landmark || ""),
    //     city: normalizeAddressField(addressData.city || ""),
    //     district: normalizeAddressField(addressData.district || ""),
    //     state: normalizeAddressField(addressData.state || ""),
    //     pinCode: normalizeAddressField(addressData.pinCode || ""),
    //     country: normalizeAddressField(addressData.country || "India"),
    //     addressType: normalizeAddressField(addressData.addressType || "Home"),
    //     note: normalizeAddressField(addressData.note || ""),
    //   };
    // }

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
      // address,
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
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${userInfo.token}`,
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

  const normalizeAddressField = (value) => {
    if (Array.isArray(value)) {
      return value.join(" ").trim();
    }
    if (value == null) {
      return "";
    }
    return String(value).trim();
  };


  const handleBreezeProceed = async () => {
    try {
      console.log("BREEZE STARTED");

      // CREATE ORDER FIRST
      const orderResult = await handleCreateOrder("breeze");

      if (!orderResult) return;

      const { order } = orderResult;

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || "{}"
      );

      const address = {
        fullName: userInfo?.name || "Customer",
        email: userInfo?.email || "customer@example.com",
        mobileNo: userInfo?.mobileNo || "9999999999",
        addressLine1: "NA",
        landmark: "NA",
        city: "Mumbai",
        district: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        country: "India",
        addressType: "Home",
      };

      console.log("FRONTEND ORDER ID:", order.orderId);

      // USE BACKEND TOTAL
      const finalAmount = Number(order.totalAmount);

      console.log("BACKEND FINAL:", finalAmount);
 // =======Add By Pawan========================================================================
      // GA4 Add Payment Info Tracking — dedup per order so re-renders/double-clicks don't double count
      const paymentInfoKey = `tracked_payment_info_${order.orderId}`;
      let alreadyTracked = false;
      try {
        alreadyTracked = !!sessionStorage.getItem(paymentInfoKey);
        if (!alreadyTracked) sessionStorage.setItem(paymentInfoKey, "1");
      } catch (e) {
        console.warn("[add_payment_info] sessionStorage unavailable:", e);
      }

      if (!alreadyTracked) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "add_payment_info",
          ecommerce: {
            currency: "INR",
            value: finalAmount,
            payment_type: "breeze",
            // items: buildItemsFromCartData(cartData), // Comment by pawan — wrong shape for raw cartData, always returned id/name undefined, price 0
            //Add by pawan----------------------------------------------------------------
            items: buildBreezeItemsFromRawCart(cartData),
            //Add by pawan----------------------------------------------------------------
          },
        });
      }
      // Add By Pawan================================================================================

      if (!BlazeSDK?.process)
      {

        console.error(
          "BlazeSDK missing"
        );

        toast.error(
          "Payment SDK not loaded"
        );

        return;
      }

      // SHIPPING DETAILS

      // const shippingDetails =
      //   JSON.parse(
      //     localStorage.getItem(
      //       "shippingDetails"
      //     )
      //   );

      // if (!shippingDetails?.address) {

      //   toast.error(
      //     "Shipping details missing"
      //   );

      //   return;
      // }

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

          console.log("BREEZE ITEM", item);

          // DEFINE BASE PRICE
          const unitPrice = Number(item.totalPrice || 0);

          // DEFINE FINAL PRICE
          // const finalUnitPrice =
          //   unitPrice + customizationTotal;

          return {

            id: String(item.item?._id),

            title:
              item.item?.jewelryName ||
              item.item?.name ||
              "Product",

            quantity:
              Number(item.quantity || 1),

            image: item.item?.images?.[0]?.url,

            initialPrice:
              Math.round(unitPrice * 100),

            finalPrice:
              Math.round(unitPrice * 100),

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

      console.log(
        "SENDING SHOP ORDER ID:",
        order.orderId
      );

      // PROCESS CHECKOUT
      BlazeSDK.process(

        {
          requestId: crypto.randomUUID(),

          service: "in.breeze.onecco",

          payload: {
            action: "startCheckout",

            shopOrderId: order.orderId,

            cart: response.data.cart,

            signature: response.data.signature,

            keyId: "BHqOsoFaflqL65A4M0lcT",

            customer: {
              countryCode: "91",

              phoneNumber: String(
                address.mobileNo
              ).replace(/\D/g, ""),

              email: address.email,

              name: address.fullName,
            },

            shippingAddress: {
              postalCode: address.pinCode,

              country: address.country,

              state: address.state,

              district: address.district,

              city: address.city,

              type: address.addressType,

              line1: address.addressLine1,

              name: address.fullName,

              nickname: "Home",

              phoneNumber: address.mobileNo,

              landmark: address.landmark,

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

          const event =
            sdkResponse?.payload?.event;

          // SUCCESS
          if (
            event === "OrderComplete" ||
            event === "Purchase" ||
            event === "CheckoutCompleted"
          ) {

            toast.success(
              "Payment successful"
            );
             // =======Add By Pawan========================================================================
            // GA4 Purchase Tracking — trackPurchaseEvent internally dedupes by orderId,
            // so it's safe even if the SDK fires this callback more than once for the same order.
            trackPurchaseEvent({
              orderId: order.orderId,
              subtotal: order.totalAmount,
              coupon: promoCode || "",
              // items: buildItemsFromCartData(cartData), // Comment by pawan — wrong shape for raw cartData, always returned id/name undefined, price 0
              //Add by pawan----------------------------------------------------------------
              items: buildBreezeItemsFromRawCart(cartData),
              //Add by pawan----------------------------------------------------------------
            });
            // Add By Pawan================================================================================

            console.log(
              "PAYMENT SUCCESS",
              sdkResponse
            );
          }

          // FAILURE
          if (
            event === "CheckoutFailed"
          ) {

            toast.error(
              "Payment failed"
            );

            console.log(
              "PAYMENT FAILED",
              sdkResponse
            );
          }
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
    }
  };  


  useEffect(() => {
    fetchCartItems();
  }, [userInfo]);

  const totalAmount = cartData.reduce((total, cartItem) => total + (Number(cartItem.totalPrice) || 0), 0);

  // --- ERROR DISPLAY ---
  if (error && !loading) {
    const isAuthError = error.includes("log in") || error.includes("Authentication");
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center px-4 bg-gray-50">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200 max-w-md text-center">
          <svg className="w-12 h-12 text-[#264A3F] mb-6 mx-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-900 mb-3 text-xl sm:text-2xl font-serif">{isAuthError ? "Access Denied" : "Something Went Wrong"}</p>
          <p className="text-gray-500 mb-8 text-[14px] sm:text-[15px]">{error}</p>
          <button onClick={() => fetchCartItems()} className="px-8 py-3 bg-[#264A3F] text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#1a3329] transition-colors w-full sm:w-auto">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- EMPTY CART ---
  if (!loading && (!cartData || cartData.length === 0)) {
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center px-4 bg-gray-50">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center max-w-lg text-center">
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-900 text-xl sm:text-2xl font-serif mb-2 sm:mb-3">Your Cart is Empty</p>
          <p className="text-gray-500 text-[14px] sm:text-[15px] mb-8">Discover our exquisite collections and find your next treasure.</p>
          <button onClick={() => navigate("/")} className="px-8 sm:px-10 py-3.5 bg-[#264A3F] text-white rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#1a3329] transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto">
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation & Header */}
        <div className="mb-6 sm:mb-10">
          <button
            className="text-[12px] sm:text-[13px] uppercase tracking-wider text-gray-500 hover:text-[#264A3F] transition-colors flex items-center gap-2 font-medium mb-4 sm:mb-6"
            onClick={() => navigate(-1)}
          >
            <span>&larr;</span> Continue Shopping
          </button>
          <div className="flex items-end justify-between border-b border-gray-200 pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900">
              Shopping Bag
            </h1>
            <span className="text-gray-500 text-sm sm:text-lg mb-1">
              {loading ? "..." : cartData.length} {cartData.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">

          {/* Left: Item List */}
          <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
            {loading
              ? Array.from({ length: initialCartCount }).map((_, index) => <CartItemSkeleton key={index} />)
              : cartData?.map((cartItem) => {
                const certificateType = cartItem.customization?.certificate?.certificateType;
                const isJewelry = cartItem.itemType === "Jewelry";
                const isProduct = cartItem.itemType === "Product";
                const hasJewelryCustomization = !!cartItem.customization?.jewelryId;

                let itemName = "Unnamed Item";
                if (isJewelry) itemName = cartItem.item?.jewelryName;
                else if (isProduct) {
                  itemName = hasJewelryCustomization ? cartItem.customization.jewelryId.jewelryName : cartItem.item?.name;
                }

                return (
                  <div key={cartItem._id} className="relative w-full bg-white rounded-[20px] sm:rounded-[24px] border border-gray-200 shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6 hover:shadow-md transition-all duration-300">

                    {/* Premium Image Container */}
                    <div className="w-[85px] h-[85px] sm:w-[140px] sm:h-[140px] rounded-[12px] sm:rounded-[16px] bg-gray-50 flex items-center justify-center p-2 sm:p-3 flex-shrink-0 border border-gray-100">
                      <img
                        src={cartItem.item?.images?.[0]?.url || BlueSapphire}
                        alt={itemName}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col">

                      {/* Title & Delete button Row */}
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-[15px] sm:text-[22px] font-serif text-gray-900 leading-snug line-clamp-2 pr-2">
                          {itemName}
                        </h2>
                        <button
                          onClick={() => handleRemoveItem(cartItem._id)}
                          className="p-1 -mr-1 -mt-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>

                      {/* Specs */}
                      <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                        <p className="text-[11px] sm:text-[13px] text-gray-500">
                          ID: <span className="text-gray-700">{cartItem.item?._id?.slice(-6).toUpperCase()}</span>
                        </p>
                        <p className="text-[11px] sm:text-[13px] text-gray-500">
                          QTY: <span className="text-gray-700">{cartItem.quantity}</span>
                        </p>

                        {isJewelry && <p className="text-[11px] sm:text-[13px] text-gray-500 line-clamp-1">Jewelry: <span className="text-gray-700">{cartItem.item?.jewelryName}</span></p>}
                        {isProduct && hasJewelryCustomization && (
                          <>
                            <p className="text-[11px] sm:text-[13px] text-gray-500 line-clamp-1">Jewelry: <span className="text-gray-700">{cartItem.customization.jewelryId?.jewelryName}</span></p>
                            <p className="text-[11px] sm:text-[13px] text-gray-500 line-clamp-1">Gemstone: <span className="text-gray-700">{cartItem.item?.name}</span></p>
                          </>
                        )}
                        {isProduct && !hasJewelryCustomization && (
                          <p className="text-[11px] sm:text-[13px] text-gray-500 line-clamp-1">Gemstone: <span className="text-gray-700">{cartItem.item?.name}</span></p>
                        )}
                      </div>

                      {/* Certificate Badge */}
                      {certificateType && (
                        <div className="mt-2 inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#264A3F]/5 border border-[#264A3F]/20">
                          <p className="text-[#264A3F] text-[9px] sm:text-[11px] uppercase tracking-widest font-bold line-clamp-1">
                            Cert: {certificateType}
                          </p>
                        </div>
                      )}

                      {/* Price (Pushed to bottom) */}
                      <div className="mt-auto pt-3 sm:pt-4">
                        <p className="text-[16px] sm:text-[22px] font-medium text-gray-900 tracking-tight">
                          Rs. {formatPrice(cartItem.totalPrice)}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>

          {/* Right: Order Summary */}
          {!loading && cartData.length > 0 && (
            <div className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-24 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 shadow-sm border border-gray-200 flex flex-col">
                <h3 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">Order Summary</h3>

                <div className="flex justify-between items-center text-gray-600 mb-3 sm:mb-4 text-[14px] sm:text-[15px]">
                  <span>Subtotal</span>
                  <span>Rs. {formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 mb-5 sm:mb-6 text-[14px] sm:text-[15px]">
                  <span>Shipping</span>
                  <span className="text-[#264A3F] font-medium text-right">Calculated at next step</span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 sm:pt-6 mb-6 sm:mb-8">
                  <span className="text-base sm:text-lg text-gray-900 font-medium">Estimated Total</span>
                  <span className="text-xl sm:text-2xl font-serif text-[#264A3F]">Rs. {formatPrice(totalAmount)}</span>
                </div>

                <button
                  // onClick={handleProceedToCheckout}
                  onClick={handleBreezeProceed}
                  className="w-full h-[50px] sm:h-[60px] bg-[#264A3F] rounded-full text-[12px] sm:text-[13px] uppercase tracking-[0.15em] text-white font-bold hover:bg-[#1a3329] hover:shadow-lg transition-all duration-300"
                >
                  Secure Checkout
                </button>

                <div className="mt-4 sm:mt-6 flex justify-center items-center gap-2 sm:gap-3 text-gray-400">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Encrypted & Secure Payment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UpSelling Component */}
      <div className="max-w-7xl mx-auto">
        <UpSellingProducts products={products} loading={upsellLoading} />
      </div>
    </div>
  );
}

export default ShoppingCart;