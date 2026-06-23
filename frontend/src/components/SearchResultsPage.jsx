import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { appendRandomString } from "../utils/randomString";

// Custom hook to parse query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ✅ New Component for professional Error/Retry display
const ProfessionalErrorBlock = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50 max-w-lg mx-auto shadow-md">
    <svg
      className="w-12 h-12 text-red-600 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      Could Not Fetch Results
    </h3>
    <p className="text-gray-700 mb-6 max-w-sm">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-[#264A3F] text-white rounded-lg font-medium hover:bg-[#1a3329] transition-colors shadow-lg"
    >
      Try Again
    </button>
  </div>
);

export default function SearchResultsPage() {
  const URL = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const query = useQuery();
  const keyword = query.get("keyword") || "";

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Increased clarity in error state for professional handling
  const [error, setError] = useState(null);

  // Function to handle the actual API call
  const fetchResults = async () => {
    if (!keyword) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // API call to fetch all matching products
      const res = await axios.get(`${URL}/product/search?keyword=${keyword}`);
      // Added defensive check for response data structure
      const products = res.data?.products?.length
        ? res.data.products
        : res.data?.jeweleries?.length
          ? res.data.jeweleries
          : [];
      setResults(products);
    } catch (err) {
      console.error("Full Search Error:", err);

      // ✅ IMPROVED ERROR MESSAGE LOGIC
      const errorMessage = err.response?.data?.message
        ? `Error: ${err.response.data.message}`
        : "We apologize, but we could not connect to the server. Please check your connection or try again shortly.";

      setError(errorMessage);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results whenever the keyword in the URL changes
  useEffect(() => {
    fetchResults();
  }, [keyword, URL]); // Now calls fetchResults directly

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString("en-IN") || "0"}`; // Using en-IN for Indian Rupees format
  };
  const handleProductClick = (product) => {
    const isJewelry = !!product.jewelryName;

    if (isJewelry) {
      const slug = product.slug || product._id;
      navigate(appendRandomString(`/details/product/${slug}`));
    } else {
      const slug = product.slug || product._id;
      navigate(appendRandomString(`/gemstones/${slug}`));
    }
  };


  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-lg text-gray-600 mb-8">
        Showing results for: "
        <span className="text-[#264A3F] font-semibold">{keyword}</span>"
      </p>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-t-4 border-[#264A3F] mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            Searching for products matching "{keyword}"...
          </p>
        </div>
      )}

      {/* ✅ PROFESSIONAL ERROR DISPLAY */}
      {!isLoading && error && (
        <ProfessionalErrorBlock message={error} onRetry={fetchResults} />
      )}

      {/* Content Display */}
      {!isLoading && !error && (
        <>
          <p className="text-gray-700 mb-6 font-medium">
            Found {results.length} results matching your query.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.length > 0 ? (
              results.map((item) => {
                const isJewelry = item.jewelryName && item.jewelryType;
                const isGemstone = item.name && item.price;

                // IMAGE
                const imageUrl = isJewelry
                  ? item.images?.[0]?.url
                  : isGemstone
                    ? item.images?.[0]?.url
                    : "/placeholder.svg";

                // NAME
                const displayName = isJewelry ? item.jewelryName : item.name;

                // TYPE LABEL
                const displayType = isJewelry ? item.jewelryType : "Gemstone";

                // PRICE
                const displayPrice = isJewelry ? item.jewelryPrice : item.price;

                return (
                  <div
                    key={item._id}
                    className="border border-gray-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    {/* IMAGE */}
                    <div className="w-full h-40 bg-gray-100 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.svg")
                        }
                      />
                    </div>

                    {/* TITLE */}
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                      {displayName}
                    </h3>

                    {/* TYPE */}
                    <p className="text-sm text-gray-500 mb-2">{displayType}</p>

                    {/* PRICE */}
                    <p className="text-xl font-bold text-[#264A3F]">
                      {formatPrice(displayPrice)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or check our products.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
