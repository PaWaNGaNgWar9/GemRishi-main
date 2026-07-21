import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import Gemvideo from "../assets/gem.mp4";
import ProductCards from "../components/ProductCard";
import TestimonialReview from "../components/Testimonals";
import JewelryCollectionFilter from "../components/filters/JewelryCollectionFilter";
import { useJewelry } from "../hooks/useJewelry";
import { useJewelryByFilter } from "../hooks/useJewelryByFilter";
import { Helmet } from "react-helmet-async";

const INITIAL_FILTERS = {
	carat: "",
	ratti: "",
	certificate: "",
	price: "",
	origin: "",
	metal: "",
	gender: "",
	color: "",
	cut: "",
	shape: "",
	treatment: "",
	featured: "",
	sort: "",
};

const ProductPage = () => {
	const navigate = useNavigate();
	const { slug } = useParams();
	const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
	const [currentPage, setCurrentPage] = useState(1);

	// Fetch jewelry subcategory + products by slug
	const { data, loading, error } = useJewelry(slug, 1);

	const subcategory = data?.subcategory;
	const products = data?.jewelleries || [];
	const productSubCategoryId = subcategory?._id || subcategory?.id || "";

	const filterQuery = useMemo(() => {
		if (!productSubCategoryId) return { skip: true, subCategory: "" };

		const [minCarat, maxCarat] = (selectedFilters.carat || "").split("-");
		const [minRatti, maxRatti] = (selectedFilters.ratti || "").split("-");
		const [minPrice, maxPrice] = (selectedFilters.price || "").split("-");

		return {
			page: currentPage,
			limit: 200,
			subCategory: productSubCategoryId,
			metal: selectedFilters.metal || undefined,
			gender: selectedFilters.gender || undefined,
			minCarat: minCarat || undefined,
			maxCarat: maxCarat || undefined,
			minRatti: minRatti || undefined,
			maxRatti: maxRatti || undefined,
			certificateType: selectedFilters.certificate || undefined,
			minPrice: minPrice || undefined,
			maxPrice: maxPrice || undefined,
			origin: selectedFilters.origin || undefined,
			color: selectedFilters.color || undefined,
			cut: selectedFilters.cut || undefined,
			shape: selectedFilters.shape || undefined,
			treatment: selectedFilters.treatment || undefined,
			featured: selectedFilters.featured || undefined,
			sort: selectedFilters.sort || undefined,
		};
	}, [productSubCategoryId, selectedFilters, currentPage]);

	const { data: filteredData, loading: filterLoading, error: filterError } = useJewelryByFilter(filterQuery);
	const filteredProducts =
		filteredData?.jeweleries ||
		filteredData?.jewelleries ||
		filteredData?.items ||
		filteredData?.products ||
		(filteredData ? [] : products) ||
		[];

	const sortedProducts = useMemo(() => {
		if (!filteredProducts.length) return [];
		let arr = [...filteredProducts];
		const latest = filteredData?.metalRates?.latestRate;

		const getTempRate = (product) => {
			const metal = product?.metal;
			if (!latest) return 0;
			switch (metal) {
				case "gold24k":
					return latest.gold.gold24k.withGSTRate * product.jewelryMetalWeight;
				case "gold22k":
					return latest.gold.gold22k.withGSTRate * product.jewelryMetalWeight;
				case "gold18k":
					return latest.gold.gold18k.withGSTRate * product.jewelryMetalWeight;
				case "silver":
					return latest.silver.withGSTRate * product.jewelryMetalWeight;
				case "platinum":
					return latest.platinum.withGSTRate * product.jewelryMetalWeight;
				case "panchadhatu":
					return latest.panchadhatu.withGSTRate * product.jewelryMetalWeight;
				default:
					return 0;
			}
		};

		if (selectedFilters.sort === "price_high_to_low") {
			arr.sort((a, b) => {
				const priceA = a.jewelryPrice + getTempRate(a);
				const priceB = b.jewelryPrice + getTempRate(b);
				return priceB - priceA; // High to Low
			});
		} else if (selectedFilters.sort === "price_low_to_high") {
			arr.sort((a, b) => {
				const priceA = a.jewelryPrice + getTempRate(a);
				const priceB = b.jewelryPrice + getTempRate(b);
				return priceA - priceB; // Low to High
			});
		}

		return arr;
	}, [filteredProducts, selectedFilters.sort, filteredData?.metalRates]);

	const originOptions = useMemo(() => {
		const set = new Set();
		(filteredProducts || []).forEach((product) => {
			if (product.origin) set.add(product.origin);
			if (product?.productId?.origin) set.add(product.productId.origin);
		});
		return Array.from(set);
	}, [filteredProducts]);

	const handleFilterChange = (key, value) => {
		setCurrentPage(1);
		setSelectedFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleClearFilters = () => {
		setCurrentPage(1);
		setSelectedFilters(INITIAL_FILTERS);
	};

	// 🔹 Skeleton loader for hero section
	const HeroSkeleton = () => (
		<div className="flex flex-col-reverse lg:flex-row justify-between items-start gap-8 lg:gap-20 mb-16 animate-pulse">
			<div className="flex-1 w-full">
				<div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
				<div className="h-4 w-full max-w-2xl bg-gray-200 rounded"></div>
				<div className="h-4 w-3/4 max-w-xl bg-gray-200 rounded mt-2"></div>
			</div>
			<div className="w-full flex justify-center lg:justify-end lg:w-auto">
				<div className="w-40 h-40 bg-gray-200 rounded-full"></div>
			</div>
		</div>
	);

	// 🔹 Skeleton loader for product cards
	const ProductSkeleton = () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="flex flex-col">
					<div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
					<div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
					<div className="h-4 w-20 bg-gray-200 rounded"></div>
				</div>
			))}
		</div>
	);

	return (
		<div>
			<Helmet>
				<title>{subcategory?.name ? `${subcategory.name} Jewelry | GemRishi India` : 'Jewelry | GemRishi India'}</title>
				<meta name="description" content={`Buy certified ${subcategory?.name || 'jewelry'} online from GemRishi India. Natural astrology jewelry with authentic certificates.`} />
			</Helmet>
			{/* Breadcrumb */}
			<div className="text-gray-900 text-sm px-4 sm:px-6 md:px-12 flex items-center space-x-2 py-4">
				<span
					className="cursor-pointer hover:text-[#264A3F] transition-colors text-[16px]"
					onClick={() => navigate("/")}>
					Home
				</span>
				<span>&gt;</span>
				<span className="text-[16px] text-[#264A3F] capitalize">{slug}</span>
			</div>

			{/* Hero Section */}
			<div className="mt-2 w-full px-4 sm:px-6 lg:px-12">
				{loading ? (
					<HeroSkeleton />
				) : subcategory ? (
					<div className="flex flex-col-reverse lg:flex-row justify-between items-start gap-8 lg:gap-20 mb-16">
						<div className="flex-1 w-full">
							<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
								{subcategory.name}
							</h1>
							<p className="text-gray-700 text-base sm:text-lg md:text-xl">
								{subcategory.description || "No description available."}
							</p>
						</div>
						<div className="w-full flex justify-center lg:justify-end lg:w-auto">
							<img
								src={subcategory.image?.url}
								alt={subcategory.name}
								className="w-48 sm:w-56 md:w-64 lg:w-48 h-auto object-contain mix-blend-multiply rounded-lg"
							/>
						</div>
					</div>
				) : (
					<p className="text-gray-500 text-lg">
						No data found for this category.
					</p>
				)}
			</div>

			{/* Tabs Section */}
			{subcategory && <Tabs categoryData={subcategory} />}

			{subcategory && (
				<JewelryCollectionFilter
					filters={selectedFilters}
					onFilterChange={handleFilterChange}
					onClear={handleClearFilters}
					originOptions={originOptions}
				/>
			)}

			{/* Product Listing */}
			<div className="bg-white px-4 sm:px-6 md:px-12 mt-8 mb-8">
				{loading || filterLoading ? (
					<ProductSkeleton />
				) : error || filterError ? (
					<div className="flex py-12 justify-center">
						<div className="bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md max-w-md w-full text-center p-8">
							<h3 className="text-lg font-semibold text-red-500 mb-2">
								Oops! Something went wrong.
							</h3>
							<p className="text-gray-600 text-sm">{error || filterError}</p>
							<button
								onClick={() => window.location.reload()}
								className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition">
								Retry
							</button>
						</div>
					</div>
				) : !filteredProducts.length ? (
					<div className="flex py-16 justify-center">
						<div className="max-w-sm w-full sm:w-80 p-8 text-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-12 h-12 mx-auto text-gray-400 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h2 className="text-lg font-semibold text-gray-700">
								No Products Found
							</h2>
							<p className="text-gray-500 text-sm mt-1">
								We couldn’t find any items in this category.
							</p>
						</div>
					</div>
				) : (
					<ProductCards category={subcategory?.name} products={sortedProducts} />
				)}
			</div>

			{/* Video Section */}
			<div className="bg-[#FAFAFA] py-16 px-4 sm:px-6 md:px-12 lg:px-24">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					<div className="text-center md:text-left">
						<h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340] mb-4">
							True gemstones are not created. They are discovered.
						</h2>
						<p className="text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
							In this guide, we’ll help you find the gemstone that truly
							resonates with your zodiac sign, personality, or planetary
							alignment.
						</p>
					</div>
					<div className="relative flex justify-center md:justify-end">
						<video
							src={Gemvideo}
							type="video/mp4"
							alt="Our Process"
							className="rounded-lg shadow-md w-full max-w-md"
							controls
							muted
						/>
					</div>
				</div>
			</div>

			{/* <TestimonialReview /> */}
		</div>
	);
};

export default ProductPage;
