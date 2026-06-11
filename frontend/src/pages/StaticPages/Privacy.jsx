import React from "react";
import AboutBG from "../../assets/AboutUs/AboutBG.svg"; // import your hero image

const PADDING_CLASS = "px-6 sm:px-10 md:px-20 lg:px-32";

const Privacy = () => {
	return (
		<>
			{/* Hero Section */}
			<div
				className="w-full h-[318px] bg-cover bg-center flex flex-col justify-center items-center text-center"
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
							window.location.href = "/";
						}}>
						Home
					</a>
					<span className="text-[#444445] text-base sm:text-[22px]">&gt;</span>
					<a
						className="text-[#444445] cursor-pointer text-base sm:text-[22px]"
						onClick={() => window.history.back()}>
						Privacy Policy
					</a>
				</div>

				{/* Title */}
				<div className="w-full h-[110px] flex justify-center items-center">
					<h1 className="text-[32px] sm:text-[42px] font-semibold">
						Privacy Policy
					</h1>
				</div>

				{/* Tagline */}
				<div className="w-full h-[150px] flex flex-col items-center text-center text-[20px] sm:text-[26px] font-semibold">
					<p>Your privacy is important to GEMRISHI.</p>
					<p>Learn how we collect, use, and protect your data.</p>
				</div>
			</div>

			{/* Main Content */}
			<div className={"w-full h-auto flex flex-col gap-6 " + PADDING_CLASS}>
				{/* Introduction */}
				<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mt-20 mb-6">
					At GEMRISHI, we are committed to protecting your privacy. This Privacy
					Policy outlines how we collect, use, and safeguard your personal
					information when you use our website and services.
				</p>

				{/* Information Collection */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Information We Collect
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We may collect personal information such as your name, email address,
					phone number, and payment details. Additionally, we collect
					information automatically through cookies and analytics to improve
					your experience.
				</p>

				{/* Use of Information */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					How We Use Your Information
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					Your information is used to process orders, provide customer support,
					improve our website, send promotional updates, and comply with legal
					obligations.
				</p>

				{/* Information Sharing */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Sharing Your Information
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We do not sell your personal information. We may share information
					with trusted third-party service providers for processing orders,
					delivering services, or complying with legal requirements.
				</p>

				{/* Security Measures */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Security
				</h2>
				<p className="text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					We implement appropriate technical and organizational measures to
					safeguard your personal data from unauthorized access, disclosure, or
					loss.
				</p>

				{/* User Rights */}
				<h2 className="text-[20px] sm:text-[24px] font-semibold text-[#264A3F] mb-4">
					Your Rights
				</h2>
				<ul className="list-disc pl-6 text-[#626262] text-[16px] sm:text-[18px] leading-relaxed mb-6">
					<li>Access and update your personal information.</li>
					<li>Request deletion of your data where applicable.</li>
					<li>Opt out of marketing communications.</li>
					<li>Withdraw consent at any time.</li>
				</ul>

				{/* Conclusion */}
				<p className="text-[#464646] text-[16px] sm:text-[20px] leading-relaxed mb-24">
					By using our website, you consent to the practices described in this
					Privacy Policy. We may update this policy periodically, and any
					changes will be posted on this page.
				</p>
			</div>
		</>
	);
};

export default Privacy;
