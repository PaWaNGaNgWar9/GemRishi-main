import React from "react";
import { useNavigate } from "react-router-dom";
import AboutBG from "../../assets/AboutUs/AboutBG.svg";

const PADDING_CLASS = "px-6 sm:px-10 md:px-20 lg:px-32";

const Shipping = () => {
	const navigate = useNavigate();

	return (
		<>
			{/* Hero Section */}
			<div
				className="w-full h-[318px] bg-cover bg-center"
				style={{ backgroundImage: `url(${AboutBG})` }}>
				{/* Breadcrumbs */}
				<div
					className={
						"w-full h-[58px] flex flex-row items-center gap-2 " + PADDING_CLASS
					}>
					<a
						href="/"
						className="text-[#444445] cursor-pointer text-base sm:text-[22px]"
						onClick={(e) => {
							e.preventDefault();
							navigate("/");
						}}>
						Home
					</a>
					<span className="text-[#444445] text-base sm:text-[22px]">&gt;</span>
					<a
						onClick={() => navigate(-1)}
						className="text-[#444445] cursor-pointer text-base sm:text-[22px]">
						Shipping Policy
					</a>
				</div>

				{/* Title */}
				<div className="w-full h-[110px] flex justify-center items-center text-center">
					<h1 className="text-[32px] sm:text-[42px] font-semibold">
						Shipping Policy
					</h1>
				</div>

				{/* Tagline */}
				<div className="w-full h-[150px] flex flex-col items-center text-center text-[18px] sm:text-[20px] font-semibold">
					<p>Secure. Reliable. Transparent.</p>
					<p>We deliver your gemstones with utmost care.</p>
				</div>
			</div>

			{/* Main Content */}
			<div className={"w-full h-auto flex flex-col gap-6 " + PADDING_CLASS}>
				{/* Introduction */}
				<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mt-20 mb-6">
					At Gemrishi, we take great pride in ensuring that your chosen
					gemstones and jewelry reach you in perfect condition and within the
					promised timeframe. We work with reputed logistics partners to ensure
					timely and secure delivery of your orders.
				</p>

				{/* Shipping Timeline */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Processing and Delivery Time
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					All confirmed orders are processed within{" "}
					<strong>2–3 business days</strong>. Once shipped, you will receive a
					confirmation email with tracking details. Delivery time depends on
					your location:
				</p>

				<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					<li>Metro cities: 3–5 business days</li>
					<li>Non-metro cities: 5–7 business days</li>
					<li>
						International orders: 10–15 business days (depending on customs
						clearance)
					</li>
				</ul>

				{/* Shipping Partners */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Our Shipping Partners
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We collaborate with trusted logistics providers such as{" "}
					<strong>Bluedart</strong>, <strong>Delhivery</strong>, and{" "}
					<strong>DTDC</strong> for domestic deliveries, and{" "}
					<strong>DHL</strong> or <strong>FedEx</strong> for international
					shipments. Every shipment is fully insured until it reaches you.
				</p>

				{/* Tracking Orders */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Order Tracking
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					Once your order has been dispatched, a tracking link will be shared
					with you via email or SMS. You can use this link to monitor the
					real-time status of your delivery. If you face any tracking issues,
					please contact our support team for assistance.
				</p>

				{/* International Shipping */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					International Shipping
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We offer worldwide shipping to select countries. Customs duties,
					import taxes, and local charges (if any) are the responsibility of the
					customer and vary by destination. Kindly check with your local customs
					office for applicable duties before placing your order.
				</p>

				{/* Packaging & Insurance */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Packaging and Insurance
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					Every product is securely packed in a tamper-proof, eco-friendly box
					to ensure safe delivery. All shipments are{" "}
					<strong>fully insured</strong> until they reach your doorstep. Please
					check the condition of the package upon receipt; if tampered or
					damaged, kindly refuse delivery and contact us immediately.
				</p>

				{/* Delays */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Delays and Exceptions
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					While we make every effort to deliver on time, unforeseen events such
					as natural calamities, lockdowns, or customs delays may affect
					shipping schedules. In such cases, our team will keep you updated
					promptly.
				</p>

				{/* Support */}
				<h3 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Need Assistance?
				</h3>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-24">
					If you have questions about your shipment, or if you need help with
					tracking or delivery issues, please contact us at{" "}
					<a
						href="mailto:support@gemrishi.com"
						className="underline text-[#264A3F] hover:text-[#1b362f]">
						support@gemrishi.com
					</a>
					. Our support team is always happy to assist.
				</p>

				{/* Footer Links */}
				<div className="text-center mb-24">
					<p className="text-[#264A3F] font-semibold text-[18px] sm:text-[22px] mb-4">
						For Crystal Jewelry Visit{" "}
						<a
							href="https://mandalagoodvibes.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-[#264A3F] hover:text-[#1b362f] transition">
							Mandala Good Vibes
						</a>
					</p>
					<p className="text-[#264A3F] font-semibold text-[18px] sm:text-[22px]">
						For Original Gemstones Visit{" "}
						<a
							href="https://gemrishi.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-[#264A3F] hover:text-[#1b362f] transition">
							Gemrishi
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default Shipping;
