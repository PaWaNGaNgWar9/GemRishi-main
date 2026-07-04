import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FAQAccordion from "../components/faq";
import TestimonialReview from "../components/Testimonals";
import Banner from "../assets/banner.jpg";
import GemstoneReviews from "./Home/GemstoneReviews.jsx";
import { useGemSuggestion } from "../hooks/useSuggest";
import { Country, State, City } from "country-state-city";
// ============================================================================
// 1. MAIN PAGE COMPONENT
// ============================================================================
const GemSuggestion = () => {
	return (
		<div className="bg-[#FCFCFC] font-sans">
			{/* --- HERO SECTION --- */}
			<div className="relative w-full h-[50vh] min-h-[400px] lg:h-[60vh]">
				<img
					src={Banner}
					alt="Gem Suggestion Banner"
					className="w-full h-full object-cover"
				/>
				{/* Premium Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col items-center justify-center text-center px-4">
               <span className="text-white/80 text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">
                  Discover Your Destiny
               </span>
					<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-wide">
						Astrological Gemstones
					</h1>
				</div>
			</div>

			{/* --- EDITORIAL INTRO --- */}
			<div className="max-w-4xl mx-auto text-center py-5 md:py-13 px-6">
				<div className="w-10 h-[2px] bg-[#264A3F] mx-auto mb-8"></div>
				<h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-6">
					A Legacy Etched in Stone
				</h2>
				<p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
					The history of gemstones is as archaic as the existence of human
					civilization. Only the usage and implications have changed and
					diversified as well with the evolution. The first classification of the
					gemstones was done by the Greeks into precious and semi-precious
					categories. With the passage of time and the emergence of umpteen
					precious and semi-precious gemstones, the classification became more
					broad and deep.
				</p>
			</div>

			{/* --- FORM & VIDEO SECTION --- */}
			<div className="w-full bg-white border-y border-gray-100">
				<div className="max-w-[1500px] mx-auto flex flex-col xl:flex-row items-stretch justify-center gap-12 lg:gap-20 p-6 md:p-12 lg:p-20">

					{/* Form Section */}
					<div className="w-full xl:w-1/2 flex justify-center xl:justify-end">
						<div className="w-full max-w-2xl">
							<GemRecommendationModal />
						</div>
					</div>

					{/* Video Section */}
					<div className="w-full xl:w-1/2 flex items-center justify-center xl:justify-start">
						<div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 bg-gray-50 relative group">
							<iframe
								className="w-full h-full absolute inset-0"
								src="https://www.youtube.com/embed/IRFFfvXkZGk?si=Wjf90u4YjH1htVlj"
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
							></iframe>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto pt-16">
				<FAQAccordion />

			</div>
			<GemstoneReviews />
		</div>
	);
};

// ============================================================================
// 2. PREMIUM GEM RECOMMENDATION FORM & MODAL
// ============================================================================

const GemRecommendationModal = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		gender: "",
		purpose: "",
		country: "",
		state: "",          // ✅ ADDED State
		placeOfBirth: "",   // ✅ This will now act as the specific City
		chartStyle: "",
		dob: { day: "", month: "", year: "" },
		tob: { hour: "", minute: "", ampm: "AM" },
	});

	const [showModal, setShowModal] = useState(false);
	const { data, loading, error, fetchGemSuggestion } = useGemSuggestion();
	const [errors, setErrors] = useState({});

	// ✅ DYNAMIC LOCATION DATA FETCHING
	const allCountries = Country.getAllCountries();
	const selectedCountryIso = allCountries.find(c => c.name === formData.country)?.isoCode;

	const allStates = selectedCountryIso ? State.getStatesOfCountry(selectedCountryIso) : [];
	const selectedStateIso = allStates.find(s => s.name === formData.state)?.isoCode;

	const allCities = selectedCountryIso && selectedStateIso ? City.getCitiesOfState(selectedCountryIso, selectedStateIso) : [];

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => {
			const newData = { ...prev, [name]: value };

			// ✅ If Country changes, reset State and City
			if (name === "country") {
				newData.state = "";
				newData.placeOfBirth = "";
			}
			// ✅ If State changes, reset City
			if (name === "state") {
				newData.placeOfBirth = "";
			}

			return newData;
		});

		setErrors((prevErrors) => {
			const newErrors = { ...prevErrors };
			if (name === "name" && value.trim()) delete newErrors.name;
			if (name === "email" && /\S+@\S+\.\S+/.test(value)) delete newErrors.email;
			if (name === "gender" && value) delete newErrors.gender;
			if (name === "purpose" && value) delete newErrors.purpose;
			if (name === "country" && value) delete newErrors.country;
			if (name === "state" && value) delete newErrors.state;
			if (name === "placeOfBirth" && value) delete newErrors.placeOfBirth;
			if (name === "chartStyle" && value) delete newErrors.chartStyle;
			if (name === "phone" && /^[0-9]{10}$/.test(value)) delete newErrors.phone;
			return newErrors;
		});
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
		if (!formData.gender) newErrors.gender = "Select gender";
		if (!formData.purpose) newErrors.purpose = "Select purpose";
		if (!formData.country) newErrors.country = "Select country";
		if (!formData.state) newErrors.state = "Select state"; // ✅ Validation added
		if (!formData.placeOfBirth) newErrors.placeOfBirth = "Select birth city"; // ✅ Validation added
		if (!formData.phone) newErrors.phone = "Enter valid 10-digit phone number";
		if (!formData.dob.day || !formData.dob.month || !formData.dob.year) newErrors.dob = "Complete date of birth is required";
		if (!formData.tob.hour || !formData.tob.minute || !formData.tob.ampm) newErrors.tob = "Complete time of birth is required";
		if (!formData.chartStyle) newErrors.chartStyle = "Select chart style";
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		try {
			const payload = { ...formData };
			await fetchGemSuggestion(payload);
			setShowModal(true);
		} catch (err) {
			console.error("Error:", err);
			alert("Unable to fetch gemstone recommendation. Please try again.");
		}
	};

	const handleCloseModal = () => setShowModal(false);

	const handleShopNow = (gemstoneName) => {
		if (!gemstoneName || gemstoneName.toLowerCase() === "none") return;

		let cleanKeyword = gemstoneName;
		const matchInside = gemstoneName.match(/\(([^)]+)\)/);
		if (matchInside) cleanKeyword = matchInside[1].trim();
		else cleanKeyword = gemstoneName.replace(/ *\([^)]*\) */g, "").trim();

		const lowerName = cleanKeyword.toLowerCase();
		if (lowerName.includes("emerald") || lowerName.includes("panna")) cleanKeyword = "Emerald";
		else if (lowerName.includes("yellow sapphire") || lowerName.includes("pukhraj")) cleanKeyword = "Yellow Sapphire";
		else if (lowerName.includes("blue sapphire") || lowerName.includes("neelam")) cleanKeyword = "Blue Sapphire";
		else if (lowerName.includes("ruby") || lowerName.includes("manik")) cleanKeyword = "Ruby";
		else if (lowerName.includes("pearl") || lowerName.includes("moti")) cleanKeyword = "Pearl";
		else if (lowerName.includes("coral") || lowerName.includes("moonga")) cleanKeyword = "Coral";
		else if (lowerName.includes("hessonite") || lowerName.includes("gomed")) cleanKeyword = "Hessonite";
		else if (lowerName.includes("cat's eye") || lowerName.includes("cats eye") || lowerName.includes("lahsuniya")) cleanKeyword = "Cat's Eye";

		window.open(`/search-results?keyword=${encodeURIComponent(cleanKeyword)}`, "_blank");
	};

	const inputClass = (err) => `w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:bg-white focus:border-[#264A3F] focus:ring-2 focus:ring-[#264A3F]/10 ${err ? '!border-red-400 !bg-red-50' : ''}`;

	return (
		<div className="w-full">
			<div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">

				<div className="text-center mb-8">
               <span className="text-[#264A3F] text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">
                  Astrological Reading
               </span>
					<h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
						Recommendation Tool
					</h2>
					<p className="text-gray-500 text-sm font-light leading-relaxed">
						Enter your birth details for a fast, precise, and expertly crafted astrological gemstone recommendation.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						{/* Name */}
						<div>
							<input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className={inputClass(errors.name)} />
							{errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</p>}
						</div>

						{/* Email */}
						<div>
							<input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className={inputClass(errors.email)} />
							{errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
						</div>

						{/* Phone */}
						<div className="flex flex-col">
							<div className={`flex bg-[#F9FAFB] border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 focus-within:bg-white focus-within:border-[#264A3F] focus-within:ring-2 focus-within:ring-[#264A3F]/10 ${errors.phone ? '!border-red-400 !bg-red-50' : ''}`}>
								<select name="countryCode" value={formData.countryCode || "+91"} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })} className="px-3 py-3.5 bg-transparent outline-none border-r border-gray-200 text-gray-600 text-sm cursor-pointer">
									<option value="+91">+91</option>
									<option value="+1">+1</option>
									<option value="+44">+44</option>
								</select>
								<input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-800 outline-none" />
							</div>
							{errors.phone && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone}</p>}
						</div>

						{/* Gender */}
						<div>
							<select name="gender" value={formData.gender} onChange={handleChange} className={inputClass(errors.gender)}>
								<option value="" disabled className="text-gray-400">Select Gender *</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
							{errors.gender && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.gender}</p>}
						</div>

						{/* Purpose */}
						<div>
							<select name="purpose" value={formData.purpose} onChange={handleChange} className={inputClass(errors.purpose)}>
								<option value="" disabled>Select Purpose *</option>
								<option value="Health">Health</option>
								<option value="Wealth">Wealth</option>
								<option value="Career">Career</option>
							</select>
							{errors.purpose && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.purpose}</p>}
						</div>

						{/* Chart Style */}
						<div>
							<select name="chartStyle" value={formData.chartStyle} onChange={handleChange} className={inputClass(errors.chartStyle)}>
								<option value="" disabled>Chart Style *</option>
								<option value="North">North Indian</option>
								<option value="South">South Indian</option>
							</select>
							{errors.chartStyle && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.chartStyle}</p>}
						</div>

						{/* ✅ DYNAMIC LOCATION DROPDOWNS */}

						{/* Country */}
						<div className="sm:col-span-2">
							<select name="country" value={formData.country} onChange={handleChange} className={inputClass(errors.country)}>
								<option value="" disabled>Select Birth Country *</option>
								{allCountries.map((c) => (
									<option key={c.isoCode} value={c.name}>{c.name}</option>
								))}
							</select>
							{errors.country && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.country}</p>}
						</div>

						{/* State */}
						<div>
							<select name="state" value={formData.state} onChange={handleChange} disabled={!formData.country} className={inputClass(errors.state)}>
								<option value="" disabled>{formData.country ? "Select Birth State *" : "Select Country First"}</option>
								{allStates.map((s) => (
									<option key={s.isoCode} value={s.name}>{s.name}</option>
								))}
							</select>
							{errors.state && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.state}</p>}
						</div>

						{/* City (Place of Birth) */}
						<div>
							<select name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} disabled={!formData.state} className={inputClass(errors.placeOfBirth)}>
								<option value="" disabled>{formData.state ? "Select Birth City *" : "Select State First"}</option>
								{allCities.map((c) => (
									<option key={c.name} value={c.name}>{c.name}</option>
								))}
							</select>
							{errors.placeOfBirth && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.placeOfBirth}</p>}
						</div>
					</div>

					{/* DOB & TOB Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
						{/* DOB */}
						<div className="flex flex-col">
							<label className="block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth *</label>
							<div className="grid grid-cols-3 gap-2">
								<select value={formData.dob.day} onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, day: e.target.value }})} className={inputClass(errors.dob)}><option value="" disabled>DD</option>{[...Array(31)].map((_, i) => (<option key={i + 1}>{i + 1}</option>))}</select>
								<select value={formData.dob.month} onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, month: e.target.value }})} className={inputClass(errors.dob)}><option value="" disabled>MM</option>{[...Array(12)].map((_, i) => (<option key={i + 1}>{i + 1}</option>))}</select>
								<select value={formData.dob.year} onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, year: e.target.value }})} className={inputClass(errors.dob)}><option value="" disabled>YYYY</option>{[...Array(100)].map((_, i) => (<option key={1980 + i}>{1980 + i}</option>))}</select>
							</div>
							{errors.dob && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.dob}</p>}
						</div>

						{/* TOB */}
						<div className="flex flex-col">
							<label className="block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Time of Birth *</label>
							<div className="grid grid-cols-3 gap-2">
								<select value={formData.tob.hour} onChange={(e) => setFormData({ ...formData, tob: { ...formData.tob, hour: e.target.value }})} className={inputClass(errors.tob)}><option value="" disabled>HH</option>{[...Array(12)].map((_, i) => (<option key={i + 1}>{i + 1}</option>))}</select>
								<select value={formData.tob.minute} onChange={(e) => setFormData({ ...formData, tob: { ...formData.tob, minute: e.target.value }})} className={inputClass(errors.tob)}><option value="" disabled>MM</option>{[...Array(60)].map((_, i) => (<option key={i}>{String(i).padStart(2, '0')}</option>))}</select>
								<select value={formData.tob.ampm} onChange={(e) => setFormData({ ...formData, tob: { ...formData.tob, ampm: e.target.value }})} className={inputClass(errors.tob)}><option>AM</option><option>PM</option></select>
							</div>
							{errors.tob && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.tob}</p>}
						</div>
					</div>

					{/* Submit Button */}
					<div className="pt-6">
						<button type="submit" className="w-full bg-[#264A3F] text-white py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#1a362e] shadow-lg shadow-[#264A3F]/20 transition-all duration-300 active:scale-[0.98]">
							Get Recommendation
						</button>
					</div>
				</form>

				{/* RESULTS MODAL REMAINS UNCHANGED */}
				{showModal && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
						<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-300">

							{/* Header */}
							<div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-6 flex justify-between items-center z-10">
								<h3 className="text-2xl font-serif text-[#264A3F]">
									Astrological Analysis
								</h3>
								<button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-xl">
									&times;
								</button>
							</div>

							<div className="p-8">
								{loading && (
									<div className="flex flex-col items-center justify-center py-16">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#264A3F]"></div>
										<p className="text-[#264A3F] mt-6 font-semibold uppercase tracking-widest text-xs">Consulting the Stars...</p>
									</div>
								)}

								{error && !loading && (
									<p className="text-red-500 text-center py-10">{error}</p>
								)}

								{data?.data && !loading && (
									<div className="space-y-8">
										{/* Details Recap */}
										<div className="bg-[#FDFDFD] border border-gray-100 p-6 rounded-2xl grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
											<div><span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Name</span><span className="font-medium text-gray-800">{data.data.name}</span></div>
											<div><span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Birth Details</span><span className="font-medium text-gray-800">{data.data.dob?.day}/{data.data.dob?.month}/{data.data.dob?.year} at {data.data.tob?.hour}:{data.data.tob?.minute} {data.data.tob?.ampm}</span></div>
											<div><span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Location</span><span className="font-medium text-gray-800">{data.data.placeOfBirth}, {data.data.state}</span></div>
											<div><span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Moon Sign (Rashi)</span><span className="font-bold text-[#264A3F] text-base">{data.data.janmaRashi}</span></div>
										</div>

										{/* Shoppable Recommendations */}
										<div className="space-y-5">
											<h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Curated For You</h4>

											{/* Moon Sign Gemstone */}
											{data.data.gemstoneFromMoonSign && (
												<div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#264A3F]/20 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Primary Match (Moon Sign)</p>
														<p className="text-xl font-serif text-[#264A3F]">{data.data.gemstoneFromMoonSign}</p>
													</div>
													<button
														onClick={() => handleShopNow(data.data.gemstoneFromMoonSign)}
														className="mt-4 sm:mt-0 px-8 py-3 bg-[#264A3F] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#1a362e] transition-colors whitespace-nowrap"
													>
														Shop Collection
													</button>
												</div>
											)}

											{/* Name Letter Gemstone */}
											{data.data.gemstoneFromNameLetter && (
												<div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#FDFDFD] border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Secondary Match (Name)</p>
														<p className="text-lg font-serif text-gray-800">{data.data.gemstoneFromNameLetter}</p>
													</div>
													<button
														onClick={() => handleShopNow(data.data.gemstoneFromNameLetter)}
														className="mt-4 sm:mt-0 px-8 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
													>
														Explore
													</button>
												</div>
											)}

											{/* Birth Month Gemstone */}
											{data.data.birthstoneByMonth && (
												<div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#FDFDFD] border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Alternative (Birth Month)</p>
														<p className="text-lg font-serif text-gray-800">{data.data.birthstoneByMonth}</p>
													</div>
													<button
														onClick={() => handleShopNow(data.data.birthstoneByMonth)}
														className="mt-4 sm:mt-0 px-8 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
													>
														Explore
													</button>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GemSuggestion;