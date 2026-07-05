import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ring from "../assets/Jwellery/Ring.svg";
import Clock from "../assets/DetailPage/Clock.svg";
import Truck from "../assets/DetailPage/Truck.svg";
import WishlistButton from "./wishlistButton";
import ShareButton from "./shareButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../redux/cartSlice";
import SharePopup from "./SharePopup";
import ReactImageMagnify from "react-image-magnify";
import { generateRandomString } from "../utils/randomStringGenerator";






function HeaderDetailPage({ product = {}, metalRates = {} }) {
	const getUserToken = () => {
		const userInfoString = localStorage.getItem("userInfo");
		if (userInfoString) {
			try {
				const userInfo = JSON.parse(userInfoString);
				return userInfo.token;
			} catch {
				return null;
			}
		}
		return null;
	};

	const URL = import.meta.env.VITE_URL;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [certificate, setCertificate] = useState("");
	const [selectedGemstoneValue, setSelectedGemstoneValue] = useState("");
	const [selectedSubstitute, setSelectedSubstitute] = useState("");
	const [selectedMetal, setSelectedMetal] = useState("");
	const [selectedPurity, setSelectedPurity] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [selectedSizeType, setSelectedSizeType] = useState("");
	const [selectedSizeNumber, setSelectedSizeNumber] = useState("");
	const [calculatedPrice, setCalculatedPrice] = useState(
		product?.jewelryPrice || 0
	);
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const images = product?.images?.map((img) => img.url);
	const videos = product?.videos || [];

	const mediaList = [
		...images.map((url) => ({ type: "image", url })),
		...videos.map((vid) => ({ type: "video", url: vid?.url || vid })),
	];


	const [selected, setSelected] = useState(0);
	const [showPopup, setShowPopup] = useState(false);

	const cleanPath = `/gemstones/${product?.slug}`; // just the real path
//---------------------Path fix by Pawan--------------------------------------------------------
	const shareUrl = `/gemstones/${product?.slug}/${generateRandomString}`;
//---------------------Path fix by Pawan--------------------------------------------------------

	useEffect(() => {
		if (product && metalRates) {
			calculateTotalPrice();
		}
	}, [
		product,
		metalRates,
		selectedGemstoneValue,
		certificate,
		selectedSubstitute,
		selectedMetal,
		selectedPurity,
	]);

	const calculateTotalPrice = () => {
		let basePrice = product?.jewelryPrice || 0;
		let total = basePrice;
		let customization = {}; // collect selected options here

		// 1️⃣ Gemstone price
		if (selectedGemstoneValue) {
			const gemObj = selectedGemstoneValue
				? JSON.parse(selectedGemstoneValue)
				: null;

			if (gemObj) {
				total += gemObj.price;
				customization.gemstoneWeight = {
					weight: gemObj.weight,
					price: gemObj.price,
				};

			}
		}

		// 2️⃣ Certificate price
		if (certificate) {
			const certObj = product.certificate?.find(
				(c) => `${c.certificateType} - ₹ ${c.price}` === certificate
			);
			if (certObj) {
				total += certObj.price;
				customization.certificate = {
					certificateType: certObj.certificateType,
					price: certObj.price,
				};

			}
		}

		// 3️⃣ Diamond substitute price
		if (selectedSubstitute) {
			const subObj = product.diamondSubstitute?.find(
				(s) => s._id === selectedSubstitute
			);
			if (subObj) {
				total += subObj.price;
				customization.diamondSubstitute = {
					_id: subObj._id,
					name: subObj.name,
					price: subObj.price,
				};

			}
		}

		// 4️⃣ Metal change adjustment (if user selects a different metal)
		if (selectedMetal && selectedMetal !== product.metal) {
			const selectedRate =
				metalRates[selectedMetal.toLowerCase()]?.withGSTRate || 0;
			const baseRate =
				metalRates[product.metal.toLowerCase()]?.withGSTRate || 0;

			if (baseRate && selectedRate) {
				const factor = selectedRate / baseRate;

				total *= factor;
			}
		}

		// 5️⃣ Universal Metal Price Calculation (Gold, Silver, Platinum, Panchadhatu)
		if (product.metal) {
			const metalType = product.metal.toLowerCase(); // gold | silver | platinum | panchadhatu

			// Collect weights (supports array, object, or number)
			const weights = Array.isArray(product.jewelryMetalWeight)
				? product.jewelryMetalWeight
				: [
					product.jewelryMetalWeight?.weight ||
					product.jewelryMetalWeight ||
					0,
				];

			let metalRate = 0;

			// ✔ Gold has purity-based pricing
			if (metalType === "gold" && selectedPurity) {
				switch (selectedPurity) {
					case "24k":
						metalRate = metalRates?.gold?.gold24k?.withGSTRate || 0;
						break;
					case "22k":
						metalRate = metalRates?.gold?.gold22k?.withGSTRate || 0;
						break;
					case "18k":
						metalRate = metalRates?.gold?.gold18k?.withGSTRate || 0;
						break;
				}
			}

			// ✔ Silver, Platinum, Panchadhatu (flat per gram pricing)
			if (metalType === "silver") {
				metalRate = metalRates?.silver?.withGSTRate || 0;
			}
			if (metalType === "platinum") {
				metalRate = metalRates?.platinum?.withGSTRate || 0;
			}
			if (metalType === "panchadhatu") {
				metalRate = metalRates?.panchadhatu?.withGSTRate || 0;
			}

			if (metalRate > 0) {
				let metalTotalPrice = 0;

				weights.forEach((w) => {
					const weightVal = Number(w.weight || w);
					if (weightVal > 0) {
						const price = weightVal * metalRate;
						metalTotalPrice += price;


					}
				});

				total += metalTotalPrice;

				customization.metal = {
					metalType,
					purity: metalType === "gold" ? selectedPurity : null,
					metalRate,
					weights,
					price: metalTotalPrice,
				};


			}
		}


		setCalculatedPrice(total);

		return customization; // 👈 optional: return customization for payload use
	};

	const handleAddToCart = async () => {
		// const userToken = getUserToken();
		// if (!userToken) {
		// 	toast.warn("Please log in to add items to the cart.", {
		// 		position: "top-center",
		// 	});
		// 	return;
		// }

		if (!product?._id) {
			toast.error("Product not found.", { position: "top-center" });
			return;
		}

		setIsAddingToCart(true);

		try {
			// helper to extract numeric value from strings like "₹ 12,345.67" or "5 Carat - ₹ 1,234"
			const extractNumber = (str) => {
				if (!str) return 0;
				const m = String(str).match(/[\d,]+(\.\d+)?/);
				return m ? Number(m[0].replace(/,/g, "")) : 0;
			};

			// Gemstone customization
			const gemstoneObj = selectedGemstoneValue
				? JSON.parse(selectedGemstoneValue)
				: null;

			// Certificate customization
			const certificateObj = certificate
				? {
					certificateType: (certificate.split(" - ₹ ")[0] || "").trim(),
					price: extractNumber(certificate),
				}
				: null;

			// Gold purity / karat calculation (ensure same logic as calculateTotalPrice)
			let purityPrice = 0;
			let goldKaratObj = null;
			if (product.metal?.toLowerCase() === "gold" && selectedPurity) {
				const weight = Number(
					product.jewelryMetalWeight?.weight || product.jewelryMetalWeight || 0
				);
				const karatKey =
					selectedPurity === "24k"
						? "gold24k"
						: selectedPurity === "22k"
							? "gold22k"
							: "gold18k";

				const purityRate =
					metalRates?.gold?.[karatKey]?.withGSTRate ||
					metalRates?.latestRate?.gold?.[karatKey]?.withGSTRate ||
					0;

				if (weight > 0 && purityRate > 0) {
					purityPrice = weight * purityRate;
					goldKaratObj = {
						karatType: karatKey,
						price: purityPrice,
					};
				}
			}

			// Diamond substitute
			const substituteObj = selectedSubstitute
				? (() => {
					const sub = product.diamondSubstitute?.find(
						(s) => s._id === selectedSubstitute
					);
					return sub
						? {
							_id: sub._id,
							name: sub.name,
							price: sub.price,
						}
						: null;
				})()
				: null;

			const customization = {
				gemstoneWeight: gemstoneObj,
				certificate: certificateObj,
				goldKarat: goldKaratObj,
				diamondSubstitute: substituteObj,
				size: selectedSizeType
					? {
						sizeType: selectedSizeType,
						size: selectedSizeNumber,
					}
					: null,
			};


			const payload = {
				itemId: product._id,
				quantity: 1,
				customization: JSON.stringify(customization),
			};

			const userToken = getUserToken();

			const config = {
				withCredentials: true,
			};

			if (userToken) {
				config.headers = {
					Authorization: `Bearer ${userToken}`,
				};
			}

			const response = await axios.post(
				`${URL}/cart/add_item_in_cart`,
				payload,
				config
			);

			if (response.data.success) {

			// GA4 Add To Cart Tracking
			window.dataLayer = window.dataLayer || [];

			window.dataLayer.push({
				ecommerce: null
			});

			window.dataLayer.push({
				event: "add_to_cart",
				ecommerce: {
				currency: "INR",
				value: calculatedPrice,

				items: [
					{
					item_id: product.sku || product._id,
					item_name: product.jewelryName,
					item_brand: "GemRishi",
					item_category: product.jewelryType || "Jewelry",
					item_variant: selectedPurity || product.metal || "",
					price: calculatedPrice,
					quantity: 1
					}
				]
				}
			});

			console.log("GA4 jewelry add_to_cart fired");

			toast.success("Item added to cart successfully!", {
				position: "top-center",
			});

			setTimeout(() => navigate("/shopping/cart"), 500);
			}			
			else {
				toast.error(response.data.message || "Failed to add to cart", {
					position: "top-center",
				});
			}
		} catch (error) {
			toast.error("Error adding to cart. Try again later.", {
				position: "top-center",
			});
			console.error(error);
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<div className="text-[14px] lg:text-[15px]">
			{/* Breadcrumb */}
			<div className="w-full flex flex-wrap items-center px-3 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-3 gap-1 sm:gap-2">
				<a
					href="/"
					className="text-[#444445] cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] hover:text-[#264A3F] transition-colors"
					onClick={(e) => {
						e.preventDefault();
						navigate("/");
					}}>
					Home
				</a>

				<span className="text-[#444445] text-[16px] sm:text-[18px]">{">"}</span>

				<span
					onClick={() => navigate(-1)}
					className="text-[#444445] cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] hover:text-[#264A3F] transition-colors">
					{product?.jewelryType}
				</span>

				<span className="text-[#444445] text-[16px] sm:text-[18px]">{">"}</span>

				<span className="text-[#444445] cursor-pointer font-medium text-[16px] sm:text-[18px] md:text-[20px] lg:text-[16px] truncate max-w-[200px] sm:max-w-none">
					{product?.jewelryName || "Product"}
				</span>
			</div>

			{/* Main Section */}
			<div className="w-full min-h-[830px] flex flex-col lg:flex-row px-4 sm:px-6 md:px-8 lg:px-20 gap-6 lg:gap-0">
				{/* Left - Images */}
				<div className="w-full lg:w-[45%] flex flex-col items-center">
					<div className="relative w-full max-w-[400px] mb-4 overflow-visible">

						{mediaList[selected].type === "image" ? (
							<ReactImageMagnify
								{...{
									smallImage: {
										alt: product.jewelryName,
										isFluidWidth: true,
										src: mediaList[selected].url,
									},
									largeImage: {
										src: mediaList[selected].url,
										width: 1000,
										height: 1000,
									},
									enlargedImagePosition: "beside",
									enlargedImageContainerDimensions: {
										width: 900,
										height: 700,
									},
									enlargedImageContainerClassName:
										"z-50 bg-white shadow-xl border rounded-lg overflow-hidden",
								}}
							/>
						) : (
							<video
								src={mediaList[selected].url}
								controls
								className="w-full h-[400px] object-contain rounded-lg bg-black"
							/>
						)}

					</div>


					<div className="grid grid-cols-5 gap-2 w-full max-w-[400px]">
						{mediaList.map((item, idx) => (
							<button
								key={idx}
								onClick={() => setSelected(idx)}
								className={`border rounded-md p-1 ${selected === idx ? "border-[#264A3F]" : "border-gray-200"
									}`}
							>
								{item.type === "image" ? (
									<img
										src={item.url}
										className="w-full h-full object-contain rounded"
									/>
								) : (
									<video
										src={item.url}
										className="w-full h-10 object-cover rounded opacity-70"
									/>
								)}
							</button>
						))}
					</div>

				</div>

				{/* Right - Details */}
				<div className="w-full lg:w-[55%] pt-4 lg:pt-8">
					<div className="w-full">
						{/* Title and Actions */}
						<div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
							<h1 className="text-xl font-bold text-gray-800">
								{product.jewelryName || "Jewelry"}
							</h1>
							<div className="flex gap-4 items-center sm:self-center">
								<WishlistButton itemId={product?._id} itemType="Jewelry" />
								<SharePopup
									productUrl={shareUrl}  // ✅ clean URL, no random prefix
									productName={product?.name || 'Our Product'}
								/>
							</div>
						</div>

						{/* Price */}
						<div className="flex flex-col gap-3 mb-6">
							<p className="text-gray-700">
								<span>SKU</span> : {product.sku}
							</p>
							<div className="flex gap-4">
								<h2 className="font-bold text-2xl sm:text-3xl lg:text-[28px] text-gray-800">
									₹{" "}
									{calculatedPrice.toLocaleString("en-IN", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</h2>
							</div>
						</div>

						{/* Selection Fields */}
						<div className="flex flex-col gap-4 mb-6">
							{/* Gemstone */}
							{product.gemstoneWeight?.length > 0 && (
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
									<label className="w-40 text-base text-gray-700">
										Gemstone Weight:
									</label>
									<select
										value={selectedGemstoneValue}
										onChange={(e) => setSelectedGemstoneValue(e.target.value)}
										className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
										<option value="">Select Weight</option>
										{product.gemstoneWeight.map((w) => (
											<option
												key={w._id}
												value={JSON.stringify({
													weight: w.weight,
													price: w.price,
												})}>
												{w.weight} Carat - ₹{w.price}
											</option>
										))}
									</select>
								</div>
							)}

							{/* Gold Purity */}
							{product &&
								metalRates &&
								product.metal?.toLowerCase() === "gold" && (
									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
										<label className="w-40 text-base text-gray-700">
											Gold Purity:
										</label>
										<select
											value={selectedPurity}
											onChange={(e) => setSelectedPurity(e.target.value)}
											className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
											<option value="">-- Please Select --</option>
											<option value="24k">
												24K Yellow Gold +₹{" "}
												{metalRates?.gold?.gold24k?.withGSTRate}
											</option>
											<option value="22k">
												22K Yellow Gold +₹{" "}
												{metalRates?.gold?.gold22k?.withGSTRate}
											</option>
											<option value="18k">
												18K Yellow Gold +₹{" "}
												{metalRates?.gold?.gold18k?.withGSTRate}
											</option>
										</select>
									</div>
								)}

							{/* Size System */}
							{Array.isArray(product.sizeSystem) &&
								product.sizeSystem.length > 0 && (
									<div className="flex flex-col gap-4">
										{/* Size Type */}
										<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
											<label className="w-40 text-base text-gray-700">
												Size Type:
											</label>
											<select
												value={selectedSizeType}
												onChange={(e) => {
													setSelectedSizeType(e.target.value);
													setSelectedSizeNumber(""); // reset size numbers when type changes
												}}
												className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
												<option value="">Select Size Type</option>
												{product.sizeSystem.map((sys) => (
													<option key={sys._id} value={sys.sizeType}>
														{sys.sizeType}
													</option>
												))}
											</select>
										</div>

										{/* Size Number */}
										{selectedSizeType && (
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
												<label className="w-40 text-base text-gray-700">
													Size:
												</label>
												<select
													value={selectedSizeNumber}
													onChange={(e) =>
														setSelectedSizeNumber(e.target.value)
													}
													className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
													<option value="">Select Size</option>
													{product.sizeSystem
														.find((sys) => sys.sizeType === selectedSizeType)
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

							{/* Diamond Substitute */}
							{Array.isArray(product.diamondSubstitute) &&
								product.diamondSubstitute.length > 0 && (
									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
										<label className="w-40 text-base text-gray-700">
											Diamond Substitute:
										</label>
										<select
											value={selectedSubstitute}
											onChange={(e) => setSelectedSubstitute(e.target.value)}
											className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
											<option value="">Select Substitute</option>
											{product.diamondSubstitute.map((sub) => (
												<option key={sub._id} value={sub._id}>
													{sub.name} — ₹ {sub.price}
												</option>
											))}
										</select>
									</div>
								)}

							{/* Certificate */}
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
								<label className="w-40 text-base text-gray-700">
									Certification:
								</label>
								<select
									value={certificate}
									onChange={(e) => setCertificate(e.target.value)}
									className="w-full sm:w-[88%] border border-gray-300 p-2 rounded bg-white text-sm sm:text-base">
									<option value="">Select Certificate</option>
									{product.certificate.map((c) => (
										<option key={c._id}>
											{c.certificateType} - ₹ {c.price}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Delivery Info */}
						<div className="w-full flex flex-col gap-4 mb-6">
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<img src={Clock} alt="clock" className="w-5 h-5" />
									<span className="text-sm sm:text-base lg:text-base text-gray-700">
										Estimated Delivery: {product?.deliveryDays || "7-10"} days
									</span>
								</div>
								<div className="flex items-center gap-2">
									<img src={Truck} alt="truck" className="w-5 h-5" />
									<span className="text-sm sm:text-base lg:text-base text-gray-700 hover:text-green-600 cursor-pointer transition-colors">
										Read about Delivery and Returns
									</span>
								</div>
							</div>

							{/* Add to Cart */}
							<div className="flex flex-col gap-2">
								<button
									onClick={handleAddToCart}
									disabled={isAddingToCart}
									className="w-full h-[50px] lg:w-[580px] sm:h-[60px] rounded-[12px] bg-[#264A3F] text-white text-base sm:text-base lg:text-[18px] font-bold hover:bg-[#1a3a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
									{isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HeaderDetailPage;
