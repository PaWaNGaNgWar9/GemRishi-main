"use client";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// सुनिश्चित करें कि BlueSapphire.svg पाथ सही है, यह सिर्फ एक उदाहरण है
import BlueSapphire from "../../assets/Stone/BlueSapphire.svg";
import { appendRandomString } from "../../utils/randomString";

const URL = import.meta.env.VITE_URL || "http://localhost:7700/api/v1";

// =========================================================
// ProductCard Component (FIXED for Navigation)
// =========================================================
const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        // ✅ FIX: क्लाइंट-जनरेटेड, नाम-आधारित स्लॉग को हटाएँ।
        // इसके बजाय, सर्वर-जनरेटेड अद्वितीय ID (_id) या slug का उपयोग करें।

        // यदि आपका API 'slug' देता है तो उसका उपयोग करें, अन्यथा _id सबसे सुरक्षित है।
        const productIdentifier = product.slug || product._id;

        if (productIdentifier) {
            // URL में product._id भेजें।
            // आपका डिटेल पेज अब इसी ID से प्रोडक्ट को API से प्राप्त करेगा।
            navigate(appendRandomString(`/gemstones/${productIdentifier}`), { state: { product } });
        } else {
            console.error("Product ID or slug is missing for navigation.");
            // वैकल्पिक रूप से: यूज़र को होम पेज पर रीडायरेक्ट करें या एक अलर्ट दिखाएँ
        }
    };

    const fallbackImage = BlueSapphire;

    // इमेज URL को यहाँ से लें और सुनिश्चित करें कि यह एक string URL है।
    const imageUrl = product.images && product.images.length > 0 && product.images[0].url
        ? product.images[0].url // Assuming image object has a 'url' property
        : fallbackImage;


    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={handleProductClick}>

            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                        e.currentTarget.className = "w-full h-full object-contain opacity-70 p-4";
                    }}
                />
            </div>

            <div className="p-3">

                <h3 className="font-semibold text-base text-gray-800 mb-1 line-clamp-2">
                    {product.name || "Untitled Product"}
                </h3>

                <div className="flex justify-between items-center mb-1">

                    <span className="text-xl font-bold text-[#264A3F]">
                        ₹{product.price?.toLocaleString("en-IN") || "N/A"}
                    </span>

                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}

                </div>

                <div className="flex flex-wrap gap-1 text-xs text-gray-600">

                    {product.carat && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.carat} Carat
                        </span>
                    )}

                    {product.subcategory && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.subcategory}
                        </span>
                    )}

                </div>

                {product.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {product.description}
                    </p>
                )}

            </div>

        </div>
    );
};

// ---

// =========================================================
// Loading Skeleton Component
// =========================================================
const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-3">
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="flex gap-1">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);

// =========================================================
// Professional Error Block Component
// =========================================================
const ProfessionalErrorBlock = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50 max-w-lg mx-auto shadow-md">
        <svg className="w-12 h-12 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
            Server Connection Issue
        </h3>
        <p className="text-gray-700 mb-6 max-w-sm">
            {/* Display the generic or specific professional message */}
            {message.includes("404") || message.includes("400") ? "The requested product category or filter combination could not be found." : "We are having trouble loading the product list. Please check your internet connection and try again."}
        </p>
        <button
            onClick={onRetry} // Call the fetch function directly
            className="px-6 py-2 bg-[#D9534F] text-white rounded-lg font-medium hover:bg-[#c9302c] transition-colors shadow-lg">
            Reload Products
        </button>
    </div>
);


// =========================================================
// Main FilterProductPage Component
// =========================================================
function FilterProductPage() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    // 1. URL search params parsing
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const parsedFilters = {};

        // Only include non-empty values
        for (const [key, value] of searchParams.entries()) {
            if (value) {
                parsedFilters[key] = value;
            }
        }

        setFilters(parsedFilters);
    }, [location.search]);

    // 2. Data Fetching Function (made reusable for re-try)
    const fetchProducts = async () => {
        if (!URL) {
            setError("Configuration error: Base URL is missing");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const searchParams = new URLSearchParams(filters);
            // Ensure no empty parameters are sent if not already filtered above
            const validSearchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(filters)) {
                if (value) {
                    validSearchParams.append(key, value);
                }
            }

            // API endpoint to fetch filtered products
            const apiUrl = `${URL}/product/filter?${validSearchParams.toString()}`;

            const response = await axios.get(apiUrl);

            let productsData = [];

            if (response.data) {
                // Robust data structure checking
                productsData = response.data.products || response.data.data || response.data.result || response.data;
                if (!Array.isArray(productsData)) {
                    productsData = []; // Default to empty array if data format is unexpected
                }
            }

            setProducts(productsData);
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            const userFriendlyMessage = error.response?.data?.message
                ? `Request failed: ${error.response.data.message}`
                : "A network error occurred. Please try reloading the products.";
            setError(userFriendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    // 3. Effect to run fetch when filters change
    useEffect(() => {
        // Only run fetch if we have filters or if the URL is base (no filters)
        if (Object.keys(filters).length > 0 || location.search === "") {
            fetchProducts();
        }
    }, [filters]);

    // Helper functions for title and summary
    const getPageTitle = () => {
        if (filters.subcategory) {
            return `${filters.subcategory} Collection`;
        } else if (filters.purpose) {
            return `Gemstones for ${filters.purpose}`;
        } else {
            return "All Gemstones";
        }
    };

    const getFilterSummary = () => {
        const summary = [];

        if (filters.subcategory) {
            summary.push(`Category: ${filters.subcategory}`);
        }
        if (filters.minCarat && filters.maxCarat) {
            summary.push(`Carat: ${filters.minCarat}-${filters.maxCarat}`);
        }

        // Simplified price display logic for brevity
        if (filters.minPrice || filters.maxPrice) {
            const minP = filters.minPrice ? Number.parseInt(filters.minPrice).toLocaleString("en-IN") : '0';
            const maxP = filters.maxPrice ? Number.parseInt(filters.maxPrice).toLocaleString("en-IN") : 'Max';
            summary.push(`Price: ₹${minP} - ₹${maxP}`);
        }

        if (filters.purpose) {
            summary.push(`Purpose: ${filters.purpose}`);
        }

        return summary;
    };

    // --- RENDER START ---
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-start justify-between">

                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-2 text-sm font-medium">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </button>

                            <h1 className="text-2xl font-bold text-gray-900">
                                {getPageTitle()}
                            </h1>

                            {getFilterSummary().length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {getFilterSummary().map((filter, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#264A3F] text-white">
                                            {filter}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700 mt-10">
                                {loading ? "Loading..." : `${products.length} Products`}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* 1. Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* 2. PROFESSIONAL Error State */}
                {!loading && error && (
                    <ProfessionalErrorBlock message={error} onRetry={fetchProducts} />
                )}

                {/* 3. No Products Found (Success, but empty result) */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm mx-auto shadow-lg">
                            <svg
                                className="w-14 h-14 text-gray-400 mx-auto mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No Matching Products Found
                            </h3>

                            <p className="text-gray-600 text-sm mb-4">
                                Please adjust your filters or try a broader search criteria.
                            </p>

                            <button
                                onClick={() => navigate("/")}
                                className="bg-[#264A3F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#245344] transition">
                                View All Gemstones
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id || product.id || index}
                                product={product}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default FilterProductPage;