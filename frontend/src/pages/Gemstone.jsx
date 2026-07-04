import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/Tabs";
import ColorFilter from "../components/filters/colorFilter";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const URL = import.meta.env.VITE_URL;

const defaultImages = [
	"/ring.png",
	"/pendant.png",
	"/bracelet.png",
	"/brooch.png",
	"/emerald.png",
	"/ruby.png",
	"/sapphire.png",
	"/opal.png",
	"/topaz.png",
];

const Gemstone = () => {
	const navigate = useNavigate();

	// ⭐ From your axios useEffect
	const [subcategories, setSubcategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// -----------------------------
	// ⭐ Fetch Subcategories (first 9)
	// -----------------------------
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`${URL}/subcategory/get-subcategories`);

				const fetched = Array.isArray(res.data.subcategories)
					? res.data.subcategories.slice(0, 9)
					: [];

				const mapped = fetched.map((item, idx) => ({
					...item,
					image: item.image?.url || defaultImages[idx],
				}));

				setSubcategories(mapped);
				setError(false);
			} catch (e) {
				console.error(e);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<Helmet>
				<title>Gemstones | GemRishi India</title>
				<meta name="description" content="Explore certified natural gemstones from GemRishi India. Birthstones, healing crystals, and astrology gems with authentic certificates." />
			</Helmet>
			{/* Breadcrumb */}
			<div className="text-gray-900 text-sm flex items-center space-x-2 p-4 px-6 sm:px-10 md:px-20 lg:px-30">
				<span
					className="cursor-pointer hover:text-[#264A3F] transition-colors text-[16px] sm:text-[18px]"
					onClick={() => navigate("/")}>
					Home
				</span>
				<span>&gt;</span>
				<span className="cursor-pointer hover:text-[#264A3F] transition-colors text-[16px] sm:text-[18px]">
					Gemstone
				</span>
			</div>

			{/* Intro */}
			<div className="mt-2 px-6 sm:px-10 md:px-20 lg:px-32">
				<h1 className="text-[28px] sm:text-[32px] lg:text-[35px] font-bold text-gray-900 mb-2">
					Gemstones
				</h1>
				<p className="text-gray-700 text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed">
					Gemstones are nature’s treasures, each carrying its own unique beauty
					and meaning...
				</p>

				{/* Tabs (your old logic still works because it reads categoryData) */}
				{/* <Tabs /> */}

				<ColorFilter />
			</div>

			{/* ⭐ Gemstone Grid (Your Required UI) */}
			<div className="w-full px-4 text-center mt-20 sm:px-10 md:px-20 lg:px-32 mb-24">
				<h2 className="text-3xl sm:text-4xl font-bold">Gemstones</h2>
				<p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
					Dive into the world of exclusive gemstones, and get yourself a
					gemstone today.
				</p>

				{loading && <p className="mt-6 text-gray-500">Loading...</p>}
				{error && <p className="mt-6 text-red-500">Failed to load gemstones</p>}

				{!loading && !error && (
					<div className="w-full px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-12 place-items-center mt-10">
						{subcategories.map((stone, index) => (
							<div
								key={index}
								className="flex flex-col items-center cursor-pointer"
								onClick={() => navigate(`/gemstone/${stone.slug}`)}>
								<img
									src={stone.image}
									alt={stone.name}
									className="w-auto h-auto max-w-[120px] max-h-[120px] sm:max-w-[150px] sm:max-h-[150px] transition-transform duration-300 hover:scale-110"
								/>
								<p className="text-gray-700 mt-3 text-center">{stone.name}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Gemstone;
