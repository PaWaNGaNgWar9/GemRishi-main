import React from "react";
import AboutBG from "../../assets/AboutUs/AboutBG.svg"; // hero background image

const PADDING_CLASS = "px-6 sm:px-10 md:px-20 lg:px-32";

const RefundPolicy = () => {
	return (
		<>
			{/* Hero Section */}
			<div
				className="w-full h-[318px] bg-cover bg-center flex flex-col justify-center items-center text-center"
				style={{ backgroundImage: `url(${AboutBG})` }}>
				{/* Breadcrumbs */}
				<div
					className={`w-full h-[58px] flex flex-row items-center gap-2 ${PADDING_CLASS}`}>
					<a
						href="/"
						className="text-[#444445] cursor-pointer text-base sm:text-[22px]"
						onClick={(e) => {
							e.preventDefault();
							window.location.href = "/";
						}}>
						Home
					</a>
					<span className="text-[#444445] text-base sm:text-[22px]">&gt;</span>
					<span className="text-[#444445] cursor-pointer text-base sm:text-[22px]">
						Refund & Return Policy
					</span>
				</div>

				{/* Title */}
				<div className="w-full h-[110px] flex justify-center items-center">
					<h1 className="text-[32px] sm:text-[42px] font-semibold">
						Refund & Return Policy
					</h1>
				</div>

				{/* Tagline */}
				<div className="w-full h-[150px] flex flex-col items-center text-center text-[20px] sm:text-[26px] font-semibold">
					<p>Customer satisfaction is our top priority.</p>
					<p>Learn about our hassle-free return and refund process.</p>
				</div>
			</div>

			{/* Main Content */}
				<div className={`w-full h-auto flex flex-col gap-6 ${PADDING_CLASS}`}>
					{/* Header */}
					<div className="mt-20 mb-6">
						<h1 className="text-[26px] sm:text-[32px] font-bold text-[#264A3F] mb-1">
							GemRishi.com – Return, Refund, Exchange & Authenticity Policy
						</h1>
						<p className="text-[#626262] text-[14px] sm:text-[16px] font-medium tracking-wide uppercase">
							A Venture of Fateh Chand Bansilal Jewellers
						</p>
					</div>

					{/* 1. Our Commitment */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						1. Our Commitment
					</h2>
					<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mb-4">
						At GemRishi, we deal in natural, unique gemstones, where no two stones are identical. Our policy is designed to ensure customer confidence, complete transparency, and strict quality control.
					</p>

					{/* 2. General Policy Framework */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						2. General Policy Framework
					</h2>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<li>Each order is eligible for a one-time return OR exchange only.</li>
						<li>All requests are subject to an internal quality inspection and strict policy compliance.</li>
					</ul>

					{/* 3. 10-Day Return Policy */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						3. 10-Day Return Policy (Loose Gemstones Only)
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						GemRishi offers a <strong>10-Day Return Window</strong> from the date of delivery.
					</p>

					{/* 4. Mandatory Conditions for Return */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						4. Mandatory Conditions for Return
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						Returns will ONLY be processed if ALL of the following conditions are fully met:
					</p>
					
					<h3 className="text-[18px] sm:text-[20px] font-medium text-[#264A3F] mb-2">
						4.1 Unboxing Video (Compulsory)
					</h3>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-2">
						A continuous, unedited video from the sealed package opening is required and must clearly show:
					</p>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						<li>The initial parcel condition and seals</li>
						<li>The product itself</li>
						<li>The laboratory certificate & invoice</li>
					</ul>
					<p className="text-[#626262] text-[16px] sm:text-[18px] italic leading-relaxed mb-4">
						Customers are strongly advised to record this at the exact time of delivery.
					</p>

					<h3 className="text-[18px] sm:text-[20px] font-medium text-[#264A3F] mb-2">
						4.2 Product Condition
					</h3>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						<li>Unused, unaltered, and undamaged.</li>
						<li>No scratches, chips, or jewelry setting/mounting work done.</li>
					</ul>

					<h3 className="text-[18px] sm:text-[20px] font-medium text-[#264A3F] mb-2">
						4.3 Documentation
					</h3>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						Must include the original laboratory certificate, original invoice, packaging materials, and any additional lab reports provided.
					</p>

					{/* 5. Valid Return Reason */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						5. Valid Return Reason (Strict Clause)
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						Returns are accepted ONLY under the following condition:
					</p>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-2">
						<strong>Color Mismatch (Defined Standard):</strong> If the gemstone shows more than 40% variation in color compared to:
					</p>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						<li>Product images or videos shared directly before purchase</li>
						<li>The GemRishi official certificate</li>
					</ul>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<strong>Verification Required:</strong> The variance must be certified by a Government-approved gemological laboratory, and the report along with the customer&apos;s video of the gemstone must objectively establish this mismatch.
					</p>

					{/* 6. Special Case – Blue Sapphire */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						6. Special Case – Blue Sapphire (Neelam)
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						Due to its unique astrological sensitivity, customers may perform a 24–72 hour trial (suitability test). Returns for Blue Sapphire are applicable only within this designated testing window.
					</p>

					{/* 7. Non-Acceptable Return Reasons */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						7. Non-Acceptable Return Reasons
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-2">
						Returns will <strong>NOT</strong> be accepted for:
					</p>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						<li>Astrologer denial (provided the delivered product matches the specifications confirmed before purchase)</li>
						<li>Change of mind or subjective dislike</li>
						<li>Budgetary concerns</li>
						<li>Naturally occurring inclusions inherent to the stone</li>
						<li>Minor color variations that fall within an acceptable range</li>
					</ul>
					<p className="text-[#626262] text-[16px] sm:text-[18px] italic leading-relaxed mb-6">
						We strongly recommend consulting with a personal astrologer or GemRishi Acharyas prior to completing your purchase.
					</p>

					{/* 8. Value-Based Return Structure */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						8. Value-Based Return Structure
					</h2>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<li><strong>Orders up to ₹49,999:</strong> Eligible for a 100% refund of the gemstone value.</li>
						<li>
							<strong>Orders ₹50,000 and above:</strong> Monetary refunds are not applicable. The customer may instead opt for an exchange (for the same or a different gemstone) with full value adjustment allowed.
						</li>
					</ul>

					{/* 9. Jewellery & Customized Products */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						9. Jewellery & Customized Products
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						Customized jewellery is strictly <strong>non-returnable</strong> and <strong>non-refundable</strong>.
					</p>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						<li><em>Exception:</em> Resizing options are available for domestic orders only.</li>
					</ul>
					<p className="text-red-600 font-medium text-[16px] sm:text-[18px] leading-relaxed mb-6">
						Critical Rule: Once a gemstone has been studded or mounted into a piece of jewellery, it automatically becomes non-returnable under any regular circumstances.
					</p>

					{/* 10. Charges Not Refundable */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						10. Charges Not Refundable
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-2">
						The following logistical and administrative costs are strictly non-refundable:
					</p>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<li>Certification charges paid directly to the grading laboratory</li>
						<li>GST and other legal taxes paid to the government</li>
						<li>All shipping charges (including return pick-up or exchange shipping fees)</li>
						<li>Payment gateway transaction charges (approximately 3% to 5%)</li>
					</ul>

					{/* 11. Shipping & Return Logistics */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						11. Shipping & Return Logistics
					</h2>
					<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<li>Return shipping expenses are to be borne entirely by the customer.</li>
						<li>Exchange shipping expenses are to be borne entirely by the customer.</li>
						<li>GemRishi covers standard shipping costs exclusively for the initial order dispatch.</li>
					</ul>

					{/* 12. Return Process */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						12. Return Process
					</h2>
					<ol className="list-decimal pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						<li>Raise a formal return request within 10 days from the delivery date.</li>
						<li>Share your compulsory unboxing video alongside all supporting documentation.</li>
						<li>Await official verification and return approval from GemRishi.</li>
						<li>Once approved, ship the product back securely. Mandatory shipping insurance is required for higher-value articles.</li>
					</ol>

					{/* 13. Security & Integrity Clause */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						13. Security & Integrity Clause
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						GemRishi follows rigorous audit and operational controls. All outbound shipments are thoroughly recorded on video during packaging. Any detected inventory mismatch, product tampering, or stone replacement attempts will lead to immediate rejection of the request, permanent restriction from our platform, and legal action as per the law of the land.
					</p>

					{/* 14. Refund Processing */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						14. Refund Processing
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						Upon formal quality approval of the returned item, your refund will be processed within <strong>7–10 working days</strong>. The finalized amount will be credited exclusively back to the original payment method and account holder.
					</p>

					{/* 15. Authenticity Guarantee */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						15. Authenticity Guarantee (Lifetime)
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-4">
						GemRishi provides an uncompromising free lifetime authenticity guarantee. Customers are welcome to verify our stones at any highly reputed global institution, such as:
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-6 mb-4 text-[#626262] text-[16px] sm:text-[18px]">
						<div>• IGI - USA</div>
						<div>• GIA - USA</div>
						<div>• GII – GJEPC, India</div>
						<div>• IIGJ – GJEPC, India</div>
						<div>• Gubelin - Switzerland</div>
						<div>• SSEF - Switzerland</div>
						<div>• GRS - Switzerland</div>
						<div>• AGL - India</div>
					</div>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						In the highly improbable event that a gemstone is proven not to be authentic or as claimed, a <strong>100% refund OR immediate exchange</strong> will be provided.
					</p>

					{/* 16. Company Rights */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						16. Company Rights
					</h2>
					<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
						GemRishi reserves the right to approve or reject any service request, interpret acceptable natural gemstone variations, and request additional verifying proof. All organizational decisions shall be final and binding.
					</p>

					{/* 17. Contact */}
					<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
						17. Need Assistance?
					</h2>
					<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mb-24">
						Our goal is to ensure your gemstone shopping experience remains delightful, trustworthy, and transparent. If you have any queries regarding our terms, please connect with us directly at{" "}
						<a href="mailto:wecare@gemrishi.com" className="underline text-[#264A3F] hover:text-[#1b362f] font-medium transition-colors duration-200">
							wecare@gemrishi.com
						</a>
						.
					</p>

					{/* Footer Links */}
					<div className="text-center mb-24">
						<p className="text-[#264A3F] font-semibold text-[18px] sm:text-[22px] mb-4">
							For Crystal Jewelry Visit{" "}
							<a
								href="https://mandalagoodvibes.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-[#264A3F] hover:text-[#1b362f] transition-colors duration-200">
								Mandala Good Vibes
							</a>
						</p>
						<p className="text-[#264A3F] font-semibold text-[18px] sm:text-[22px]">
							For Original Gemstones Visit{" "}
							<a
								href="https://gemrishi.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-[#264A3F] hover:text-[#1b362f] transition-colors duration-200">
								Gemrishi
							</a>
						</p>
					</div>
				</div>
		</>
	);
};

export default RefundPolicy;
