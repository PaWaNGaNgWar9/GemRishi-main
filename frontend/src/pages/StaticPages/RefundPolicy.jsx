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
				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mt-20 mb-4">
					Overview
				</h2>
				<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mb-6">
					At <strong>Gemrishi</strong>, we take great pride in offering genuine,
					certified gemstones and handcrafted jewelry. Each item is made or
					selected with care and precision. However, if you are not entirely
					satisfied with your purchase, we’re here to help.
				</p>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					Return Eligibility
				</h2>
				<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					<li>
						Returns are accepted within <strong>7 days</strong> of receiving the
						product.
					</li>
					<li>
						Items must be in their <strong>original condition</strong> — unused,
						undamaged, and with all original certificates and packaging intact.
					</li>
					<li>
						Customized, engraved, or made-to-order items are{" "}
						<strong>not eligible</strong> for return or exchange.
					</li>
					<li>
						Shipping charges, taxes, and duties are{" "}
						<strong>non-refundable</strong>.
					</li>
				</ul>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					How to Initiate a Return
				</h2>
				<ol className="list-decimal pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					<li>
						Email us at{" "}
						<a
							href="mailto:support@gemrishi.com"
							className="underline text-[#264A3F]">
							support@gemrishi.com
						</a>{" "}
						with your order number and reason for return.
					</li>
					<li>
						Once approved, we’ll provide return instructions and a shipping
						address.
					</li>
					<li>
						Pack the product securely with all accompanying documents and send
						it to the mentioned address.
					</li>
				</ol>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					Refunds
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					Once we receive your returned item, it will be inspected for quality
					and authenticity. Upon approval, your refund will be processed within{" "}
					<strong>7–10 business days</strong>. Refunds will be issued to your
					original payment method. In case of payment gateway charges or
					transaction fees, those may be deducted from the total refundable
					amount.
				</p>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					Exchange Policy
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We accept exchanges only for products that are defective, damaged, or
					incorrectly delivered. Please notify us within{" "}
					<strong>48 hours</strong> of receiving your order, along with product
					images and invoice details. Our team will guide you through the
					exchange process.
				</p>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					Cancellation Policy
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					Orders can be cancelled within <strong>24 hours</strong> of purchase
					before shipment. Once dispatched, the order cannot be cancelled and
					will follow our return process.
				</p>

				<h2 className="text-[22px] sm:text-[26px] font-semibold text-[#264A3F] mb-4">
					Exceptions
				</h2>
				<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					<li>Custom or engraved items.</li>
					<li>Loose gemstones set in custom jewelry.</li>
					<li>Products damaged due to mishandling or wear and tear.</li>
					<li>Items purchased during promotional sales or discounts.</li>
				</ul>

				<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mb-6">
					Our goal is to ensure your shopping experience at{" "}
					<strong>Gemrishi</strong> remains delightful and transparent. Please
					read this policy carefully before placing your order.
				</p>

				{/* Footer CTA */}
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
