"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Added for Modal Animation

// Import all assets
import BlueSapphire from "../../assets/Stone/BlueSapphire.svg";
import Energized from "../../assets/DetailPage/Energized.svg";
import Original from "../../assets/DetailPage/Original.svg";
import Shipping from "../../assets/DetailPage/Shipping.svg";
import Clock from "../../assets/DetailPage/Clock.svg";
import Truck from "../../assets/DetailPage/Truck.svg";
import RingIcon from "../../assets/DetailPage/RingP.svg";
import PendantIcon from "../../assets/DetailPage/PendantP.svg";
import BraceletIcon from "../../assets/DetailPage/BraceletP.svg";
import NecklaceIcon from "../../assets/DetailPage/necklace.svg";
import EarringsIcon from "../../assets/DetailPage/earring.svg";
import WishlistButton from "../../components/wishlistButton";
import SharePopup from "../../components/SharePopup";
import { useJewelryByFilter } from "../../hooks/useJewelryByFilter";
import { getLatestMetalRates } from "../../api/metalRates";
import ReactImageMagnify from "react-image-magnify";
import GemstonePopup from "../../components/popup";
import { XMarkIcon } from "@heroicons/react/24/outline"; // ✅ Icon for closing modal

// Helper function to extract user token
const getUserToken = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      return userInfo.token;
    } catch (e) {
      console.error("Failed to parse userInfo from localStorage", e);
      return null;
    }
  }
  return null;
};

// --- Component Definition ---
function HeaderDetailPage({ onSendId }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const URL = import.meta.env.VITE_URL;
  const dispatch = useDispatch();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  // Gemstone States
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState("");
  const [certificatePrice, setCertificatePrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Mini Cart Modal State
  const [showCartModal, setShowCartModal] = useState(false);

  // Jewelry Customization States
  const [isInterestedInJewelry, setIsInterestedInJewelry] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Ring");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedSizeSystem, setSelectedSizeSystem] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [metalRates, setMetalRates] = useState(null);
  const [selectedGemstoneValue, setSelectedGemstoneValue] = useState("");
  const [selectedDiamondSubstitute, setSelectedDiamondSubstitute] =
    useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 90;

  // Fetch metal rates
  const fetchMetalRates = async () => {
    try {
      const rates = await getLatestMetalRates();
      setMetalRates(rates);
    } catch (error) {
      console.error("Error fetching metal rates:", error);
    }
  };

  // --- Product Data Fetching Effect ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) {
        setError("No product identifier provided (slug is missing).");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${URL}/product/single-gemstone/${slug}`,
        );

        let fetchedData =
          response.data.data || response.data.product || response.data;
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          fetchedData = fetchedData[0];
        }

        if (fetchedData && (fetchedData.name || fetchedData._id)) {
          setProductData(fetchedData);

          const freeCert = fetchedData.certificate?.find(
            (cert) =>
              (cert.type || cert.name || "").toLowerCase().includes("free") ||
              cert.price === 0,
          );
          const initialCert =
            freeCert || (fetchedData.certificate && fetchedData.certificate[0]);
          if (initialCert) {
            const certValue =
              initialCert._id || initialCert.type || initialCert;
            setCertificate(certValue);
            setCertificatePrice(initialCert.price || 0);
          } else {
            setCertificate("");
            setCertificatePrice(0);
          }
        } else {
          setError("No product data found in API response.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const status = err.response?.status;
        if (status === 404) {
          setError(`Product not found for slug: ${slug}`);
        } else if (status === 500) {
          setError("Server error - please try again later.");
        } else {
          setError(
            `Failed to load product data: ${err.message || "Network error"}`,
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    fetchMetalRates();
  }, [slug, URL]);
  // --- Certificate Price Update Effect ---
  useEffect(() => {
    if (productData && certificate) {
      const selectedCert = productData.certificate?.find(
        (cert) => (cert._id || cert.type || cert) === certificate,
      );
      setCertificatePrice(selectedCert?.price || 0);
    } else if (!certificate && productData) {
      setCertificatePrice(0);
    }
  }, [certificate, productData]);

  // --- Selected Image Transition Effect ---
  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 220);
    return () => clearTimeout(t);
  }, [selectedImageIndex]);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  // Auto-hide cart modal after 6 seconds
  useEffect(() => {
    if (showCartModal) {
      const timer = setTimeout(() => setShowCartModal(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showCartModal]);

  // --- Helper Functions ---
  const getProductMedia = useCallback(() => {
    const media = [];
    if (productData?.images && Array.isArray(productData.images)) {
      productData.images.forEach((img) => {
        media.push({
          type: "image",
          url: img.url || img,
          alt: productData.name || "Product Image",
        });
      });
    }
    if (productData?.videos && Array.isArray(productData.videos)) {
      productData.videos.forEach((video) => {
        media.push({
          type: "video",
          url: video.url || video,
          alt: productData.name || "Product Video",
        });
      });
    }
    return media;
  }, [productData]);
  const mediaItems = useMemo(() => {
    if (!productData) return [];
    return getProductMedia();
  }, [getProductMedia]);
  const handlePrevImage = () => {
    if (!mediaItems.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    if (!mediaItems.length) return;
    setSelectedImageIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1,
    );
  };
  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString() || 0}`;
  };

  const getMetalRate = (metalType) => {
    if (!metalRates || !metalType) return 0;
    const metalKey = metalType?.toLowerCase();

    if (metalKey?.includes("gold")) {
      if (metalKey.includes("18")) {
        return metalRates.gold?.gold18k?.withGSTRate || 0;
      } else if (metalKey.includes("22")) {
        return metalRates.gold?.gold22k?.withGSTRate || 0;
      } else {
        return metalRates.gold?.gold24k?.withGSTRate || 0;
      }
    } else if (metalKey === "silver") {
      return metalRates.silver?.withGSTRate || 0;
    } else if (metalKey === "platinum") {
      return metalRates.platinum?.withGSTRate || 0;
    } else if (metalKey === "panchadhatu") {
      return metalRates.panchadhatu?.withGSTRate || 0;
    }
    return 0;
  };

  const isInStock = productData?.inStock !== false && productData?.stock !== 0;

  // --- Add to Cart Handler for Gemstone ---
  const handleAddToCart = async () => {
    if (!isInterestedInJewelry) {
      await handleGemstoneAddToCart();
    } else {
      await handleJewelryAddToCart();
    }
  };

  const handleGemstoneAddToCart = async () => {
    if (!productData?._id) {
      toast.error("Product ID not found. Cannot add to cart.", {
        position: "top-center",
      });
      return;
    }

    if (!isInStock) {
      toast.error("This item is currently out of stock.", {
        position: "top-center",
      });
      return;
    }

    const userToken = getUserToken();

    try {
      setIsAddingToCart(true);

      let customizationPayload = {};

      if (certificate) {
        const selectedCert = productData.certificate?.find(
          (cert) => (cert._id || cert.type || cert) === certificate,
        );

        if (selectedCert) {
          const certDisplayName =
            selectedCert.type ||
            selectedCert.name ||
            selectedCert.certificateType ||
            certificate;

          customizationPayload = {
            certificate: {
              certificateType: certDisplayName,
              price: selectedCert.price || 0,
            },
          };
        }
      }

      const payload = {
        itemId: productData._id,
        quantity: quantity || 1,
        customization: customizationPayload,
      };

      const headers = { "Content-Type": "application/json" };
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const response = await axios.post(
        `${URL}/cart/add_item_in_cart`,
        payload,
        {
          headers: headers,
          withCredentials: true,
        },
      );

      dispatch(addItemToCart(payload));

      if (response.data.success) {

        // GA4 Add To Cart Tracking
        window.dataLayer = window.dataLayer || [];

        // Clear previous ecommerce object
        window.dataLayer.push({
          ecommerce: null
        });

        window.dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            currency: "INR",

            value: (productData.price || 0) + certificatePrice,

            items: [
              {
                item_id: productData.sku || productData._id,
                item_name: productData.name,
                item_brand: "MyBrand",
                item_category: "Gemstones",
                item_variant: productData.origin || "",
                price: (productData.price || 0) + certificatePrice,
                quantity: quantity || 1
              }
            ]
          }
        });

        console.log("GA4 add_to_cart fired");

        // Existing mini cart popup
        setShowCartModal(true);
      } else {
        toast.error(response.data.message || "Failed to add item to cart", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401) {
        toast.warn("Guest cart is not enabled on server. Please log in.", {
          position: "top-center",
        });
      } else if (error.response?.status === 400) {
        
        // It tries to grab the exact message from your backend, or falls back to a default message.
        const errorMsg = error.response?.data?.message || error.response?.data?.msg || "This item is already in your cart!";
        toast.info(errorMsg, { position: "top-center" });
      } else {
        toast.error("Failed to add item to cart.", { position: "top-center" });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct || !metalRates) return;
    let basePrice = selectedProduct.jewelryPrice || 0;
    let total = basePrice;
    const selectedMetalKey = selectedMetal?.toLowerCase();
    const productMetalKey = selectedProduct.metal?.toLowerCase();

    let selectedRate = 1;
    let productRate = 1;

    if (selectedMetalKey?.includes("gold")) {
      if (selectedMetalKey.includes("18")) {
        selectedRate = metalRates.gold.gold18k.withGSTRate;
      } else if (selectedMetalKey.includes("22")) {
        selectedRate = metalRates.gold.gold22k.withGSTRate;
      } else {
        selectedRate = metalRates.gold.gold24k.withGSTRate;
      }
    } else if (selectedMetalKey === "silver") {
      selectedRate = metalRates.silver.withGSTRate;
    } else if (selectedMetalKey === "platinum") {
      selectedRate = metalRates.platinum.withGSTRate;
    } else if (selectedMetalKey === "panchadhatu") {
      selectedRate = metalRates.panchadhatu.withGSTRate;
    }

    if (productMetalKey?.includes("gold")) {
      if (productMetalKey.includes("18")) {
        productRate = metalRates.gold.gold18k.withGSTRate;
      } else if (productMetalKey.includes("22")) {
        productRate = metalRates.gold.gold22k.withGSTRate;
      } else {
        productRate = metalRates.gold.gold24k.withGSTRate;
      }
    } else if (productMetalKey === "silver") {
      productRate = metalRates.silver.withGSTRate;
    } else if (productMetalKey === "platinum") {
      productRate = metalRates.platinum.withGSTRate;
    } else if (productMetalKey === "panchadhatu") {
      productRate = metalRates.panchadhatu.withGSTRate;
    }

    const factor = selectedRate / productRate;
    total *= factor;

    setCalculatedPrice(Math.round(total));
  };

  useEffect(() => {
    if (isInterestedInJewelry) {
      calculateTotalPrice();
    }
  }, [selectedProduct, selectedMetal, metalRates, isInterestedInJewelry]);

  useEffect(() => {
    if (productData?._id && typeof onSendId === "function") {
      onSendId(productData._id);
    }
  }, [productData]);


  // GA4 Ecommerce Tracking for Product View
  useEffect(() => {

  if (!productData) return;

  window.dataLayer = window.dataLayer || [];

  // clear previous ecommerce object
  window.dataLayer.push({
    ecommerce: null
  });

  // fire GA4 product view
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "INR",
      value: productData.price || 0,

      items: [
        {
          item_id: productData.sku || productData._id,
          item_name: productData.name,
          item_brand: "MyBrand",
          item_category: "Gemstones",
          item_variant: productData.origin || "",
          price: productData.price || 0,
          quantity: 1
        }
      ]
    }
  });

  console.log("GA4 view_item fired");

  }, [productData]);

  const handleJewelryAddToCart = async () => {
    const userToken = getUserToken();

    if (!selectedProduct?._id) {
      toast.error("Select a product first.", { position: "top-center" });
      return;
    }

    setIsAddingToCart(true);

    const selectedCertObj = productData.certificate.find(
      (c) => (c._id || c.type || c.certificateType) === certificate,
    );

    try {
      const customization = {
        metal: selectedMetal || selectedProduct.metal,
        sizeSystem: {
          sizeType: selectedSizeSystem,
          sizeNumber: selectedSize,
        },
        totalPrice: totalPrice || calculatedPrice,
        gemstoneWeight: selectedGemstoneValue
          ? {
            weight: parseFloat(selectedGemstoneValue.split(" ")[0]),
            price: parseFloat(selectedGemstoneValue.split("₹")[1]),
          }
          : null,
        diamondSubstitute: selectedDiamondSubstitute
          ? {
            name: selectedDiamondSubstitute.split(" - ₹ ")[0],
            price: parseFloat(selectedDiamondSubstitute.split("₹")[1]),
          }
          : null,
        goldKarat: selectedMetal
          ? {
            karatType: selectedMetal,
            price:
              metalRates?.gold?.[selectedMetal]?.withGSTRate *
              (selectedProduct.jewelryMetalWeight || 0),
          }
          : null,
        certificate: selectedCertObj
          ? {
            certificateType:
              selectedCertObj.certificateType ||
              selectedCertObj.type ||
              selectedCertObj.name,
            price: selectedCertObj.price || 0,
          }
          : null,
        jewelryId: selectedProduct?._id ? selectedProduct._id : null,
      };

      const payload = {
        itemId: productData._id,
        quantity: 1,
        customization,
      };

      const headers = { "Content-Type": "application/json" };
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const res = await axios.post(`${URL}/cart/add_item_in_cart`, payload, {
        headers: headers,
        withCredentials: true,
      });

      if (res.data.success) {
        // ✅ Trigger Mini Cart Modal instead of navigating
        setShowCartModal(true);
      } else {
        toast.error(res.data.message || "Failed to add item", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-center",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Jewelry Filters
  const sidebarFilters = [
    { label: "Ring", icon: RingIcon },
    { label: "Pendant", icon: PendantIcon },
    { label: "Bracelet", icon: BraceletIcon },
    { label: "Necklace", icon: NecklaceIcon },
    { label: "Earrings", icon: EarringsIcon },
  ];

  const sizeOptions = {
    Size_system: [
      "Indian Ring Size System",
      "US Ring Size System",
      "UK/Australia Ring Size System",
      "Europe Ring Size System",
    ],
    Size_number: Array.from({ length: 19 }, (_, i) => i + 1),
    Quality: [
      { label: "Gold 18K", value: "gold18k", base: "gold" },
      { label: "Gold 22K", value: "gold22k", base: "gold" },
      { label: "Gold 24K", value: "gold24k", base: "gold" },
      { label: "Silver", value: "silver", base: "silver" },
      { label: "Platinum", value: "platinum", base: "platinum" },
      { label: "Panchadhatu", value: "panchadhatu", base: "panchadhatu" },
    ],
  };

  const selectedMetalObj = sizeOptions.Quality.find(
    (m) => m.value === selectedMetal,
  );
  const baseMetal = selectedMetalObj?.base || selectedMetal;

  const jewelryFilters = useMemo(() => {
    if (!productData || !productData.subCategory?._id) {
      return {
        limit: 12,
        jewelryType: selectedCategory,
        metal: baseMetal,
        productSubCategory: "",
      };
    }

    return {
      limit: 12,
      jewelryType: selectedCategory,
      metal: baseMetal,
      productSubCategory: productData.subCategory._id,
    };
  }, [selectedCategory, baseMetal, productData]);

  const { data: jewelryData, loading: jewelryLoading } =
    useJewelryByFilter(jewelryFilters);

  if (loading) {
    return <div className="w-full animate-pulse"></div>;
  }

  if (error || !productData) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20">
        <p className="text-red-600 mb-4 ">{error || "No product data found"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#264A3F] text-white rounded-lg hover:bg-[#1a3329] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentMedia = mediaItems[selectedImageIndex];
  const totalItemPrice = (productData.price || 0) + certificatePrice;

  // -----------------Fix By Pawan disbale why gemrishi option------------------------------
  const renderJewelryCustomizationSection = () => (
    <div className="w-full mb-6 space-y-8">
      {/* Title */}
      <div className="flex items-center flex-col mb-4 text-center">
        <h3 className="text-2xl font-semibold text-[#264A3F]">
          Select for Ring / Pendant / Bracelets / Necklace / Earrings
        </h3>
        <p className="text-blue-400 text-sm ">
          Choose a category or upload your custom design.
        </p>
      </div>

      {/* Main Layout — now a single column: category row on top, content below */}
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full">
          {sidebarFilters.map((item) => (
            <div
              key={item.label}
              onClick={() => setSelectedCategory(item.label)}
              className={`flex-1 min-w-[90px] max-w-[150px] h-[100px] sm:h-[120px] border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${selectedCategory === item.label
                ? "border-[#20A079] bg-green-50 shadow-lg scale-105"
                : "border-gray-200 hover:shadow-md hover:-translate-y-[2px]"
                }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-8 h-8 object-contain mb-3"
              />
              <p className="text-[14px] font-medium text-gray-800 text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 max-w-4xl mx-auto w-full space-y-8">
          {/* Metal Selector */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-4 p-6 rounded-xl">
            <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
              <label className="text-base font-medium text-gray-700 whitespace-nowrap">
                Metal Type:
              </label>
              <select
                value={selectedMetal}
                onChange={(e) => {
                  setSelectedMetal(e.target.value);
                  setSelectedProduct(null);
                }}
                className="w-full sm:w-[300px] lg:w-[400px] h-[50px] border-2 rounded-lg border-gray-300 px-4 text-gray-700 focus:ring-2 focus:ring-[#264A3F] outline-none text-base"
              >
                <option value="">Select Metal</option>
                {sizeOptions.Quality.map((metal) => (
                  <option key={metal.value} value={metal.value}>
                    {metal.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {selectedMetal && (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-[#264A3F] text-center lg:text-left">
                Available Design
              </h4>

              {/* ==================== fix by pawan alignment of jewellery ==================== */}
              {/*
                Root cause: the heading above is "text-center lg:text-left" but the
                card list used to be a flex row with "justify-center". On desktop that
                centers the ROW AS A GROUP, so with only 1-2 results the cards clump
                toward the middle instead of starting under the left-aligned heading —
                producing the big empty gap on the right seen in the screenshots.

                Fix: use a CSS grid instead of flex-wrap + justify-center. Grid items
                naturally flow left-to-right / top-to-bottom and stay aligned under the
                heading no matter how many cards come back from the API, while still
                centering on mobile to match the "text-center" heading there.
              */}
              {jewelryLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#264A3F] mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading designs...</p>
                </div>
              ) : jewelryData?.jeweleries?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center lg:justify-items-start">
                  {jewelryData.jeweleries.map((item, index) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct({ ...item, index });

                        const gemstoneWeight = productData.weight;
                        const metalPrice =
                          getMetalRate(selectedMetal) * gemstoneWeight;
                        const gemstonePrice = productData.price;

                        const totalJewelryPrice =
                          item.jewelryPrice +
                          metalPrice +
                          gemstonePrice +
                          certificatePrice;

                        setTotalPrice(totalJewelryPrice);
                      }}
                      className={`w-full max-w-[260px] p-4 border-2 rounded-xl bg-white flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${selectedProduct?.index === index
                        ? "border-[#20A079] bg-green-50 shadow-lg scale-105"
                        : "border-gray-200 hover:shadow-lg hover:-translate-y-[2px]"
                        }`}
                    >
                      <img
                        src={item.images?.[0]?.url || "/placeholder.svg"}
                        alt={item.jewelryName}
                        className="w-24 h-24 object-contain mb-4"
                      />

                      <p className="text-base font-semibold text-gray-800 mb-2">
                        {item.jewelryName || "Unnamed"}
                      </p>

                      <p className="text-sm text-gray-600 mb-2 capitalize">
                        {item.jewelryType} • {item.metal}
                      </p>

                      {item.origin && (
                        <p className="text-xs text-gray-500 mb-2">
                          Origin: {item.origin}
                        </p>
                      )}

                      {/* Price */}
                      <div className="text-center">
                        <p className="text-base font-bold text-[#264A3F] mb-1">
                          ₹
                          {(
                            item.jewelryPrice +
                            getMetalRate(selectedMetal) *
                            item.jewelryMetalWeight +
                            productData.price
                          ).toLocaleString("en-IN")}
                        </p>

                        {/* Clean Description (NO word cut, max 2 lines) */}
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.jewelryDesc}
                        </p>

                        {/* View Details */}
                        <a
                          href={`${frontendUrl}/details/product/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block px-4 py-1.5 bg-[#264A3F] text-white rounded-md text-sm hover:bg-[#1b362f] transition"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl ">
                  <p className="text-gray-500 text-base">
                    No jewelry found for selected type and metal.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try selecting a different metal type or category.
                  </p>
                </div>
              )}
              {/* ================== end fix by pawan alignment of jewellery ================== */}
            </div>
          )}

          {/* Size Selection for Rings */}
          {selectedMetal && (
            <div className="flex flex-row flex-wrap justify-center gap-6 p-6 rounded-xl">
              {/* Size System */}
              <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                <label className="text-base font-medium text-gray-700 whitespace-nowrap">
                  Size System:
                </label>

                <select
                  value={selectedSizeSystem}
                  onChange={(e) => {
                    setSelectedSizeSystem(e.target.value);
                    setSelectedSize(""); // reset size when system changes
                  }}
                  className="w-full sm:w-[300px] h-[50px] border-2 rounded-lg border-gray-300 px-4 text-gray-700 focus:ring-2 focus:ring-[#264A3F] outline-none"
                >
                  <option value="">Select Size System</option>

                  {selectedProduct?.sizeSystem.map((system) => (
                    <option key={system.sizeType} value={system.sizeType}>
                      {system.sizeType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ring Size */}
              {selectedSizeSystem && (
                <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                  <label className="text-base font-medium text-gray-700 whitespace-nowrap">
                    Ring Size:
                  </label>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full sm:w-[150px] h-[50px] border-2 rounded-lg border-gray-300 px-4 text-gray-700 focus:ring-2 focus:ring-[#264A3F] outline-none"
                  >
                    <option value="">Select Size</option>

                    {/* show sizes only for selected system */}
                    {selectedProduct?.sizeSystem
                      .find((s) => s.sizeType === selectedSizeSystem)
                      ?.sizeNumbers.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Jewelry Customization Options */}
          {selectedProduct && (
            <div className="space-y-6 border-t pt-6">
              <h4 className="text-xl font-semibold text-[#264A3F] text-center lg:text-left">
                Customization Options
              </h4>

              <div className="flex flex-row flex-wrap justify-center gap-6">
                {/* Diamond Substitute */}
                {selectedProduct?.isDiamondSubstitute &&
                  selectedProduct?.diamondSubstitute?.length > 0 && (
                    <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Diamond Substitute
                      </label>
                      <select
                        value={selectedDiamondSubstitute}
                        onChange={(e) =>
                          setSelectedDiamondSubstitute(e.target.value)
                        }
                        className="w-full sm:w-[300px] h-[50px] border-2 rounded-lg border-gray-300 px-4 text-gray-700 focus:ring-2 focus:ring-[#264A3F] outline-none"
                      >
                        <option value="">Select Substitute</option>
                        {selectedProduct.diamondSubstitute.map(
                          (d, index) => (
                            <option
                              key={index}
                              value={`${d.name} - ₹ ${d.price}`}
                            >
                              {d.name} — ₹
                              {d.price.toLocaleString("en-IN")}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  )}
              </div>

              {/* Add to Cart Button for Jewelry */}
              <div className="flex flex-col gap-4  pt-6">
                <div className="flex items-center justify-center gap-2 text-gray-700 text-sm sm:text-base">
                  <img src={Truck} alt="Truck" className="w-5 h-5" />
                  <span className="text-sm sm:text-base lg:text-[18px]">
                    Estimated Delivery:{" "}
                    {isInterestedInJewelry
                      ? "15 - 30 days"
                      : "5 - 7 days"}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedProduct?._id}
                  className={`w-full h-[50px] lg:w-[580px] sm:h-[60px] rounded-[12px] text-white text-base sm:text-base lg:text-[18px] font-bold transition-colors duration-200 mx-auto ${!selectedProduct
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#264A3F] hover:bg-[#1a3a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                >
                  {isAddingToCart
                    ? "Adding to Cart..."
                    : !selectedProduct
                      ? "Select a Design First"
                      : "Add to Cart"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ✅ Add to Cart Success Modal */}
      <AnimatePresence>
        {showCartModal && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[70px] lg:top-[130px] right-4 sm:right-8 w-full max-w-[370px] bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="font-semibold text-gray-800 text-sm">Added to Cart Successfully</span>
              </div>
              <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex gap-4">
              <img src={mediaItems[0]?.url || "/placeholder.svg"} alt="Product" className="w-16 h-16 object-cover rounded-md border border-gray-100" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {isInterestedInJewelry ? selectedProduct?.jewelryName : productData?.name}
                </p>
                <p className="text-sm font-bold text-[#264A3F] mt-1">
                  {formatPrice(isInterestedInJewelry ? totalPrice : (totalItemPrice * quantity))}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-4 pb-4 flex flex-col gap-2">
              <button
                onClick={() => { setShowCartModal(false); navigate("/shopping/cart"); }}
                className="w-full py-2.5 bg-[#264A3F] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1a3329] transition-colors"
              >
                View Cart / Checkout
              </button>
              <button
                onClick={() => setShowCartModal(false)}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="text-[14px] lg:text-[15px]">
        {/* Breadcrumbs */}
        <div className="w-full flex flex-wrap items-center px-3 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-3 gap-1 sm:gap-2">
          <a
            href="/"
            className="text-[#444445] cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] hover:text-[#264A3F] transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Home
          </a>
          <span className="text-[#444445] text-[16px] sm:text-[18px]">
            {">"}
          </span>
          <a
            onClick={() => navigate(-1)}
            className="text-[#444445] cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] hover:text-[#264A3F] transition-colors"
          >
            Gemstone
          </a>
          <span className="text-[#444445] text-[16px] sm:text-[18px]">
            {">"}
          </span>
          <span className="text-[#444445] cursor-pointer font-medium text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] truncate max-w-[200px] sm:max-w-none">
            {productData?.name || "Product"}
          </span>
        </div>

        {/* Main Content */}
        <div className="w-full min-h-[830px] flex flex-col lg:flex-row px-4 sm:px-6 md:px-8 lg:px-20 gap-6 lg:gap-0">
          {/* Left Column - Images */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start pt-4 lg:pt-8">
            <div className="w-full max-w-[500px] flex flex-col items-center">
              {/* Stock Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {isInStock ? (
                  <>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[33px] lg:h-[33px] bg-[#0B9519] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-[#0B9519] text-sm sm:text-base lg:text-[18px] font-bold">
                      This item is available
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[33px] lg:h-[33px] bg-[#DC2626] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-[#DC2626] text-sm sm:text-base lg:text-[18px] font-bold">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Main Image/Video */}
              <div className="relative w-full max-w-[320px] h-[200px] sm:h-[250px] lg:h-[284px] flex items-center justify-center mb-4 overflow-visible">
                <button
                  onClick={handlePrevImage}
                  className="absolute left-[-20px] sm:left-[-30px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 text-2xl font-bold text-gray-800"
                >
                  ‹
                </button>
                {currentMedia?.type === "video" ? (
                  <video
                    src={currentMedia.url}
                    className={`w-full h-full object-contain rounded-lg transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"
                      }`}
                    controls
                  />
                ) : (
                  <div className="relative w-full h-full overflow-visible flex items-center justify-center">
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: currentMedia?.alt || productData.name,
                          isFluidWidth: true,
                          src: currentMedia?.url || "/placeholder.svg",
                        },
                        largeImage: {
                          src: currentMedia?.url || "/placeholder.svg",
                          width: 1000,
                          height: 1000,
                        },
                        enlargedImagePosition: "beside",
                        enlargedImageContainerDimensions: {
                          width: 900,
                          height: 700,
                        },
                        enlargedImageContainerClassName:
                          "zoom-right-fix z-50 bg-white shadow-xl border rounded-lg overflow-hidden",
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={handleNextImage}
                  className="absolute right-[-20px] sm:right-[-30px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-gray-800 hover:bg-gray-100 "
                >
                  ›
                </button>

                {isTransitioning && (
                  <div className="absolute inset-0 rounded-lg bg-gray-100 animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2 lg:gap-3 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] px-2 sm:px-5">
                {mediaItems.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-full aspect-square rounded-md bg-white flex items-center justify-center shadow-sm transition-all ${selectedImageIndex === idx
                      ? "border-b-[3px] border-[#264A3F]"
                      : "border-b-[3px] border-transparent"
                      }`}
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt="thumbnail"
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover rounded"
                        muted
                      />
                    )}

                    {media.type === "video" && (
                      <span className="absolute top-1 left-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="rgba(0,0,0,0.35)" />
                          <polygon points="7,5 13,9 7,13" fill="#fff" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-[55%] pt-4 lg:pt-8">
            <div className="w-full">
              {/* Title and Actions */}
              <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h1 className="text-xl font-bold text-gray-800">
                  {productData.name || "Gemstone"}
                </h1>
                <div className="flex gap-4 items-center sm:self-center">
                  <WishlistButton
                    itemId={productData?._id}
                    itemType="Product"
                  />
                  {/* ------------fix  by Pawan-------------------------------------------- */}
                  <SharePopup
                  productUrl={window.location.href}
                  productName={productData?.name || "Our Product"}
                   />{" "}
                   {/* ------------fix  by Pawan-------------------------------------------- */}
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-3 mb-6">
                <p className="text-gray-700">
                  <span>SKU</span> : {productData.sku}
                </p>
                <div className="flex gap-4">
                  <h2 className="font-bold text-2xl sm:text-3xl lg:text-[28px] text-black">
                    {formatPrice(totalItemPrice * quantity)}
                  </h2>
                  {productData?.sellPrice ? (
                    <h2 className="font-bold line-through text-xl sm:text-xl text-gray-500">
                      {formatPrice(productData.sellPrice)}
                    </h2>
                  ) : null}
                </div>
              </div>

              {/* Specifications */}
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-base text-gray-700">
                  <span className="text-black">{productData.name}:</span>{" "}
                  Natural & Certified Gemstone
                </p>
                <p className="text-base text-gray-700">
                  <span className="text-black">Origin:</span>{" "}
                  {productData.origin || "Not specified"}
                </p>
                <p className="text-base text-gray-700">
                  <span className="text-black">Carat:</span>{" "}
                  {productData.carat || "Not specified"} carats
                </p>
                <p className="text-base text-gray-700">
                  <span className="text-black">Ratti:</span>{" "}
                  {productData.ratti || "Not specified"} ratti
                </p>
              </div>

              {/* Certification */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-8 lg:gap-20 mb-6 ">
                <label className="text-base text-gray-700 text-center">
                  Certification :
                </label>
                <select
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="border border-gray-500 p-2 rounded-[10px] w-full sm:w-[300px] lg:w-[366px] h-[46px] text-sm sm:text-base text-center"
                >
                  {productData.certificate &&
                    Array.isArray(productData.certificate) &&
                    productData.certificate.length > 0 ? (
                    productData.certificate.map((cert, index) => {
                      const certValue = cert._id || cert.type || cert;
                      const certName =
                        cert.type ||
                        cert.name ||
                        cert.certificateType ||
                        certValue;
                      return (
                        <option key={index} value={certValue}>
                          {certName}
                          {cert.price > 0 && ` (+${formatPrice(cert.price)})`}
                          {cert.price === 0 &&
                            certName.toLowerCase().includes("free") &&
                            ` (Free)`}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">No options available</option>
                  )}
                </select>
              </div>

              {/* Jewelry Toggle */}
              <div className="w-full mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-md text-gray-700 font-medium">
                    Select Ring/Pandent
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInterestedInJewelry}
                      onChange={(e) =>
                        setIsInterestedInJewelry(e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#264A3F]"></div>
                  </label>
                </div>
              </div>

              {/* ✅ Jewelry customization: rendered immediately after the toggle,
                   */}
              {isInterestedInJewelry && (
                <div className="flex justify-center items-center">
                  {renderJewelryCustomizationSection()}
                </div>
              )}
 {/* --------------fix by pawan Why Gemrishi — only shown when NOT customizing jewelry--------------------- */}
              {!isInterestedInJewelry && (
                <div className="w-full mb-6">
                  <p className="text-base sm:text-base lg:text-[18px] mb-4">
                    Why Gemrishi ?
                  </p>
                 <div className="flex flex-row gap-2 sm:gap-4 lg:gap-6">
               <div className="w-[160px] h-[90px] lg:w-[200px] lg:h-[100px] bg-gray-200 flex items-center justify-center gap-3 rounded-lg px-4">
             <img src={Energized} alt="Energized" className="w-10 h-10" />
             <p className="text-[12px] font-bold leading-tight">
                Effectively <br /> Energized
              </p>
              </div>
              <div className="w-[160px] h-[90px] lg:w-[200px] lg:h-[100px] bg-gray-200 flex items-center justify-center gap-3 rounded-lg px-4">
             <img src={Original} alt="Original" className="w-10 h-10" />
            <p className="text-[12px] font-bold leading-tight">
             100% Original <br /> and Authentic
            </p>
            </div>
        <div className="w-[160px] h-[90px] lg:w-[200px] lg:h-[100px] bg-gray-200 flex items-center justify-center gap-3 rounded-lg px-4">
          <img src={Shipping} alt="Shipping" className="w-10 h-10" />
             <p className="text-[12px] font-bold leading-tight">
               Free Shipping <br /> Available
             </p>
            </div>
           </div>
                  <div className="w-full flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start mt-2 gap-4 lg:gap-30">
                    <div className="flex items-center gap-2">
                      <img
                        src={Clock || "/placeholder.svg"}
                        alt="Clock"
                        className="w-5 h-5"
                      />
                      <span className="text-sm sm:text-base lg:text-base">
                        Estimated Delivery: 5 -7 days
                      </span>
                  </div>
                </div>
 {/* --------------fix by pawan Why Gemrishi — only shown when NOT customizing jewelry--------------------- */}
                {!isInterestedInJewelry && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        isAddingToCart || !productData?._id || !isInStock
                      }
                      className={`w-full h-[50px] lg:w-[580px] sm:h-[60px] rounded-[12px] text-white text-base sm:text-base lg:text-[18px] font-bold transition-colors duration-200 ${!isInStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#264A3F] hover:bg-[#1a3a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                    >
                      {isAddingToCart
                        ? "Adding to Cart..."
                        : !isInStock
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </button>
                    
                  </div>
                )}
              </div>
                </div>
              )}
              {/* ----------------------------this is upper div----------------------------------------------- */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderDetailPage;