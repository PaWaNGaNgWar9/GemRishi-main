"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StoneImg from "../../assets/Stone/BlueSapphire.svg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import WishlistButton from "../../components/wishlistButton";
import VideoModal from "../../components/models/VideoModal";
import { Play, Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countries from "../../JSON/countries.json";
import { appendRandomString } from "../../utils/randomString";

function StoneCollection() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_URL;

  const INITIAL_FILTERS = {
    gemname: "",
    minWeight: "",
    maxWeight: "",
    minCarat: "",
    maxCarat: "",
    minPrice: "",
    maxPrice: "",
    minRatti: "",
    maxRatti: "",
    origin: "",
    treatment: "",
    cut: "",
    shape: "",
    color: "",
    featured: "",
    sort: "",
    certificateType: "",
      quality: "",
  };

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const firstLoadRef = useRef(true);
  const [error, setError] = useState(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);

  const [originCountries, setOriginCountries] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

    const itemsPerPage = 24;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
//----------------- Add By Pawan for total product----------------------------
const [totalProducts, setTotalProducts] = useState(0);
//----------------- Add By Pawan for total product----------------------------

  const [selectedColor, setSelectedColor] = useState("Select Color");

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const fetchOriginCountries = async () => {
    try {
      const res = await axios.get(
        `${URL}/product/get-product-origin-countries-list/${slug}`
      );
      setOriginCountries(res.data.originsList || []);
    } catch (err) {
      console.error("Error loading origin countries", err);
    }
  };

  const fetchProducts = async () => {
    if (!slug) return;
    try {
      setError(null);
      if (firstLoadRef.current) setLoading(true);
      else setPageLoading(true);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...selectedFilters,
      });

      const response = await axios.get(
        `${URL}/product/filter?subcategory=${slug}&${queryParams.toString()}`
      );

      const data = response.data || {};
      setProducts(Array.isArray(data.products) ? data.products : []);
      setCategoryName(
        data.name || data.subcategory?.name || "Stone Collection"
      );
      setTotalPages(data.totalPages || 1);
//------------------Add by Pawan  for total products------------------------------
      setTotalProducts(data.totalProducts || 0);
//------------------Add by Pawan  for total products------------------------------

    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
      setTotalPages(1);
// ------------Add by Pawan  for total products------------------------------
      setTotalProducts(0);
// ------------Add by Pawan  for total products------------------------------
    } finally {
      if (firstLoadRef.current) {
        setLoading(false);
        firstLoadRef.current = false;
      } else {
        setPageLoading(false);
      }
    }
  };

  const updateFilter = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ---------------------------- Add By Pawan for 1,2,3,....last page ----------------------------
  const getVisiblePages = () => {
    if (totalPages <= 1) return [];

    const firstCount = 4;   // always show pages 1,2,3,4
    const siblingCount = 1; // show one neighbor on each side of the current page

    const shown = new Set();
    for (let i = 1; i <= Math.min(firstCount, totalPages); i++) shown.add(i);
    for (let i = Math.max(1, currentPage - siblingCount); i <= Math.min(totalPages, currentPage + siblingCount); i++) shown.add(i);
    shown.add(totalPages); // always show the last page

    const sorted = Array.from(shown).sort((a, b) => a - b);

    const pages = [];
    let prev = 0;
    sorted.forEach((page) => {
      if (prev && page - prev > 1) {
        pages.push(`ellipsis-${prev}`);
      }
      pages.push(page);
      prev = page;
    });

    return pages;
  }
  // ---------------------------- End Add By Pawan for 1,2,3,....last page ----------------------------

  useEffect(() => {
    fetchProducts();
  }, [slug, currentPage, selectedFilters]);

  useEffect(() => {
    fetchOriginCountries();
  }, [slug]);

  const applyFilter = (key, value) => {
    setCurrentPage(1);
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
// -------------------------Fixed By Pawan------------------------------------------------------
  const handleProductClick = (productSlug, e) => {
    if (e.target.closest("button")) return;
      navigate(appendRandomString(`/gemstones/${productSlug}`));
    // -----------Commment By Pawan-----------------------------------------------------------------
    // window.open(appendRandomString(`/gemstones/${productSlug}`), "_blank", "noopener,noreferrer");
        // -----------Commment By Pawan-----------------------------------------------------------------
  };

  const formatPrice = (price) => `Rs.${price?.toLocaleString() || "0"}`;

  if (loading)
    return (
      <div className="flex flex-col px-4 sm:px-10 py-10 w-full">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#264A3F] mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col px-3 sm:px-6 md:px-10 py-6 w-full">
      {/* HEADER SECTION */}
      <div className="w-full text-center mt-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-[#000]">
          {categoryName} Online Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-4">
          Explore our stunning online collection!
        </p>
         {/* -------------------------Add By Pawan total Products----------------------------- */}
        <p className="text-lg  text-black  border border-dotted border-gray-300 p-4 rounded-md font-semibold">
         Total Products : {totalProducts}
       </p>
        {/* -------------------------Add By Pawan total Products--------------------------- */}
      </div>

      {/* MOBILE FILTER ACCORDION */}
      <div className="lg:hidden mb-4">
        <details className="border rounded-lg">
          <summary className="cursor-pointer px-4 py-3 font-semibold bg-gray-50 rounded-lg">
            Filters & Sorting
          </summary>

          <div className="p-4 flex flex-col gap-3">
            {/** Sort */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.sort}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
            >
              <option value="">Sort</option>
              <option value="price_low_to_high">Price: Low to High</option>
              <option value="price_high_to_low">Price: High to Low</option>
              <option value="weight_low_to_high">Weight: Low to High</option>
              <option value="weight_high_to_low">Weight: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/** Carat */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.minCarat && selectedFilters.maxCarat ? `${selectedFilters.minCarat}-${selectedFilters.maxCarat}` : ""}
              onChange={(e) => {
                const val = e.target.value.split("-");
                setSelectedFilters((prev) => ({ ...prev, minCarat: val[0], maxCarat: val[1] }));
                setCurrentPage(1);
              }}
            >
              <option value="">Carat</option>
              <option value="0-3">0–3 Carat</option>
              <option value="3-5">3–5 Carat</option>
              <option value="5-8">5–8 Carat</option>
              <option value="8-20">8–20 Carat</option>
            </select>

            {/** Ratti */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.minRatti && selectedFilters.maxRatti ? `${selectedFilters.minRatti}-${selectedFilters.maxRatti}` : ""}
              onChange={(e) => {
                const val = e.target.value.split("-");
                setSelectedFilters((prev) => ({ ...prev, minRatti: val[0], maxRatti: val[1] }));
              }}
            >
              <option value="">Ratti</option>
              <option value="0-3">0–3 Ratti</option>
              <option value="3-5">3–5 Ratti</option>
              <option value="5-8">5–8 Ratti</option>
              <option value="8-20">8–20 Ratti</option>
            </select>

            {/** Certificate */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.certificateType}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, certificateType: e.target.value }))
              }
            >
              <option value="">Certificate</option>
              <option value="Free">Free</option>
              <option value="IGI">IGI</option>
              <option value="GIA">GIA</option>
              <option value="GII">GII</option>
              <option value="IIGJ">IIGJ</option>
              <option value="GRS">GRS</option>
              <option value="SSEF">SSEF</option>
            </select>
            {/** Price */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.minPrice && selectedFilters.maxPrice ? `${selectedFilters.minPrice}-${selectedFilters.maxPrice}` : ""}
              onChange={(e) => {
                const val = e.target.value.split("-");
                setSelectedFilters((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
              }}
            >
              <option value="">Price</option>
              <option value="0-5000">Below 5k</option>
              <option value="5000-20000">5k–20k</option>
              <option value="20000-50000">20k–50k</option>
              <option value="50000-200000">50k–2L</option>
            </select>

            {/** Origin */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.origin}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, origin: e.target.value }))
              }
            >
              <option value="">Origin</option>
              {originCountries.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>

            {/** Color - with variant support */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.color}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, color: e.target.value }))
              }
            >
              <option value="">Color</option>
              <option value="Red">Red (All Shades)</option>
              <option value="Blue">Blue (All Shades)</option>
              <option value="Green">Green (All Shades)</option>
              <option value="Yellow">Yellow (All Shades)</option>
              <option value="Pink">Pink (All Shades)</option>
              <option value="Purple">Purple (All Shades)</option>
              <option value="Violet">Violet (All Shades)</option>
              <option value="Orange">Orange (All Shades)</option>
              <option value="White">White (All Shades)</option>
              <option value="Grey">Grey (All Shades)</option>
              <option value="Black">Black (All Shades)</option>
              <option value="Brown">Brown (All Shades)</option>
              <option value="Golden">Golden (All Shades)</option>
            </select>

            {/** Cut */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.cut}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, cut: e.target.value }))
              }
            >
              <option value="">Cut</option>
              <option value="Cabochon">Cabochon</option>
              <option value="Carving">Carving</option>
              <option value="Faceted">Faceted</option>
              <option value="Tablet">Tablet</option>
              <option value="Brilliant">Brilliant</option>
            </select>

            {/** Shape */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.shape}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, shape: e.target.value }))
              }
            >
              <option value="">Shape</option>
              <option value="Oval">Oval</option>
              <option value="Round">Round</option>
              <option value="Cushion">Cushion</option>
              <option value="Emerald Cut">Emerald Cut</option>
              <option value="Radiant">Radiant</option>
              <option value="Asscher - Octagon">Asscher - Octagon</option>
              <option value="Pear">Pear</option>
              <option value="Fancy">Fancy</option>
              <option value="Marquise">Marquise</option>
              <option value="Princess">Princess</option>
              <option value="Rough">Rough</option>
              <option value="Trillion">Trillion</option>
              <option value="Various">Various</option>
            </select>

            {/** Treatment */}
            <select
              className="border px-3 py-2 rounded"
              value={selectedFilters.treatment}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, treatment: e.target.value }))
              }
            >
              <option value="">Treatment</option>
              <option value="Oil">Oil</option>
              <option value="No Oil">No Oil</option>
              <option value="Heated">Heated</option>
              <option value="Non Heated">Non Heated</option>
            </select>
{/* ----------------------------_Add By Pawan--------------------------------- */}
             {/* Quality */}
 <select
   className="border px-2 py-2 rounded"
   value={selectedFilters.minPrice && selectedFilters.maxPrice ? `${selectedFilters.minPrice}-${selectedFilters.maxPrice}` : ""}
    onChange={(e) => {
    const val = e.target.value.split("-");
    setSelectedFilters((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
      }}>
        <option value="">Quality</option>
<option value="50-20000">Good (₹0-₹20K)</option>
<option value="20001-100000">Premium (₹20K-₹1.0L)</option>
<option value="100001-500000">Luxury (₹1.0L-₹5.0L)</option>
<option value="500001-1500000">Exclusive(Above ₹5.0L)</option>
</select>

            <button
              className="cursor-pointer bg-red-600 p-2 rounded text-white"
              onClick={() => {
                setSelectedFilters(INITIAL_FILTERS);
                setCurrentPage(1);
              }}
            >
              Clear All
            </button>
          </div>
        </details>
      </div>
  {/* ------------------------------------------------------------------------------ */}

      {/* DESKTOP FILTERS */}
      <div className="hidden lg:flex flex-wrap items-center gap-3 overflow-x-auto whitespace-nowrap pb-3 scrollbar-hide">
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.minCarat && selectedFilters.maxCarat ? `${selectedFilters.minCarat}-${selectedFilters.maxCarat}` : ""}
          onChange={(e) => {
            const val = e.target.value.split("-");
            setSelectedFilters((prev) => ({ ...prev, minCarat: val[0], maxCarat: val[1] }));
          }}
        >
          <option value="">Carat</option>
          <option value="0-3">0–3 Carat</option>
          <option value="3-5">3–5 Carat</option>
          <option value="5-8">5–8 Carat</option>
          <option value="8-20">8–20 Carat</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.minRatti && selectedFilters.maxRatti ? `${selectedFilters.minRatti}-${selectedFilters.maxRatti}` : ""}
          onChange={(e) => {
            const val = e.target.value.split("-");
            setSelectedFilters((prev) => ({ ...prev, minRatti: val[0], maxRatti: val[1] }));
          }}
        >
          <option value="">Ratti</option>
          <option value="0-3">0–3 Ratti</option>
          <option value="3-5">3–5 Ratti</option>
          <option value="5-8">5–8 Ratti</option>
          <option value="8-20">8–20 Ratti</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.certificateType}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, certificateType: e.target.value }))}
        >
          <option value="">Certificate</option>
          <option value="Free">Free</option>
          <option value="IGI">IGI</option>
          <option value="GIA">GIA</option>
          <option value="GII">GII</option>
          <option value="IIGJ">IIGJ</option>
          <option value="GRS">GRS</option>
          <option value="SSEF">SSEF</option>
        </select>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.minPrice && selectedFilters.maxPrice ? `${selectedFilters.minPrice}-${selectedFilters.maxPrice}` : ""}
          onChange={(e) => {
            const val = e.target.value.split("-");
            setSelectedFilters((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
          }}
        >
          <option value="">Price</option>
          <option value="0-5000">Below 5k</option>
          <option value="5000-20000">5k–20k</option>
          <option value="20000-50000">20k–50k</option>
          <option value="50000-200000">50k–2L</option>
        </select>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40 hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.origin}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, origin: e.target.value }))}
        >
          <option value="">Origin</option>
          {originCountries.map((ct) => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>

        {/** Color - with variant support */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.color}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, color: e.target.value }))}
        >
          <option value="">Color</option>
          <option value="Red">Red (All Shades)</option>
          <option value="Blue">Blue (All Shades)</option>
          <option value="Green">Green (All Shades)</option>
          <option value="Yellow">Yellow (All Shades)</option>
          <option value="Pink">Pink (All Shades)</option>
          <option value="Purple">Purple (All Shades)</option>
          <option value="Violet">Violet (All Shades)</option>
          <option value="Orange">Orange (All Shades)</option>
          <option value="White">White (All Shades)</option>
          <option value="Grey">Grey (All Shades)</option>
          <option value="Black">Black (All Shades)</option>
          <option value="Brown">Brown (All Shades)</option>
          <option value="Golden">Golden (All Shades)</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.cut}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, cut: e.target.value }))}
        >
          <option value="">Cut</option>
          <option value="Cabochon">Cabochon</option>
          <option value="Carving">Carving</option>
          <option value="Faceted">Faceted</option>
          <option value="Tablet">Tablet</option>
          <option value="Brilliant">Brilliant</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.shape}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, shape: e.target.value }))}
        >
          <option value="">Shape</option>
          <option value="Oval">Oval</option>
          <option value="Round">Round</option>
          <option value="Cushion">Cushion</option>
          <option value="Emerald Cut">Emerald Cut</option>
          <option value="Radiant">Radiant</option>
          <option value="Asscher - Octagon">Asscher - Octagon</option>
          <option value="Pear">Pear</option>
          <option value="Fancy">Fancy</option>
          <option value="Marquise">Marquise</option>
          <option value="Princess">Princess</option>
          <option value="Rough">Rough</option>
          <option value="Trillion">Trillion</option>
          <option value="Various">Various</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.treatment} 
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, treatment: e.target.value }))}
        >
          <option value="">Treatment</option>
          <option value="Oil">Oil</option>
          <option value="No Oil">No Oil</option>
          <option value="Heated">Heated</option>
          <option value="Non Heated">Non Heated</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.featured}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, featured: e.target.value }))}
        >
          <option value="">Featured</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 hover:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F] transition"
          value={selectedFilters.sort}
          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, sort: e.target.value }))}
        >
          <option value="">Sort</option>
          <option value="price_low_to_high">Price: Low to High</option>
          <option value="price_high_to_low">Price: High to Low</option>
          <option value="weight_low_to_high">Weight: Low to High</option>
          <option value="weight_high_to_low">Weight: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        {/* {--------------Quality-----------------} */}
{/* ----------------------Add By Pawan------------------------------------------------ */}
        <select
     className="border px-2 py-2 rounded"
     value={selectedFilters.minPrice && selectedFilters.maxPrice ? `${selectedFilters.minPrice}-${selectedFilters.maxPrice}` : ""}
     onChange={(e) => {
     const val = e.target.value.split("-");
     setSelectedFilters((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
       }}
            >
<option value="">Quality</option>
<option value="50-20000">Good (₹0-₹20K)</option>
<option value="20001-100000">Premium (₹20K-₹1.0L)</option>
<option value="100001-500000">Luxury (₹1.0L-₹5.0L)</option>
<option value="500001-1500000">Exclusive(Above ₹5.0L)</option>
            </select>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-medium"
          onClick={() => {
            setSelectedFilters(INITIAL_FILTERS);
            setCurrentPage(1);
          }}
        >
          Clear All
        </button>
      </div>
{/* ----------------------------------------------------------------------------------------- */}
      {/* PRODUCT GRID */}
      <div className={`w-full grid ${products.length === 1 ? "place-items-center grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"} gap-4 sm:gap-6 mt-4 sm:mt-6`}>
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-[16px] h-full shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between items-center pt-6 sm:pt-8 relative cursor-pointer pb-6 border border-gray-100 group"
            onClick={(e) => handleProductClick(product.slug, e)}
          >
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              <WishlistButton itemId={product._id} itemType="Product" />
              {product.videos?.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const firstVideo = product.videos[0];
                    setSelectedVideo(typeof firstVideo === "string" ? firstVideo : firstVideo?.url);
                    setShowModal(true);
                  }}
                  className="p-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
                >
                  <Play className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            <div className="w-full px-4 sm:px-6">
              <img
                src={product?.images?.[0]?.url || StoneImg}
                alt={product.name}
                className="w-full h-[140px] sm:h-[180px] lg:h-[220px] object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col items-center mt-4 px-3 w-full">
              <h2 className="text-sm sm:text-[15px] font-bold text-center text-[#0B1D3A] line-clamp-2 leading-snug">
                {product.name}
              </h2>

              <span className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs px-2.5 py-1 rounded-md mt-2 border border-gray-100">
                Origin: {product.origin || "Unknown"}
              </span>

              <p className="text-sm sm:text-base text-[#264A3F] mt-3 font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
        ))}
        <VideoModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedVideo(null);
          }}
          videoUrl={selectedVideo}
        />
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1))
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${currentPage === 1
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}>
            Previous
          </button>

          {/* ---------------------------- Add By Pawan for 1,2,3,....last page ---------------------------- */}
          <div className="flex gap-1 sm:gap-2 mx-2">
            {getVisiblePages().map((page, idx) =>
              typeof page !== "number" ? (
                <span
                  key={`${page}-${idx}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-semibold text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${currentPage === page
                    ? "bg-[#264A3F] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
          {/* ---------------------------- End Add By Pawan for 1,2,3,....last page ---------------------------- */}

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages))
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${currentPage === totalPages
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StoneCollection;