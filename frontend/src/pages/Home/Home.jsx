import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import StoneCollection from "./StoneCollection";
import JewelleryCollection from "./JewelleryCollection";
import LegacyTrust from "./LegacyTrust";
// import ExclusiveJewellery from "./ExclusiveJewellery";
// import TestimonialReview from "./TestimonialReview";
import TrustBadges from "../../components/trust";
import VideoSection from "./VideoSection";
import GemstoneReviews from "./GemstoneReviews";
import Legacy from "./Legacy";
import GemstoneEducationYoutubeSection from "./GemstoneEducationYoutubeSection";
import { FaWhatsapp } from "react-icons/fa";
// -------------------Add By Pawan--------------------------------------
import SlideImage from "./SlideImage"; 
// -------------------Add By Pawan--------------------------------------

function Home() {
  return (
    <>
      <Helmet>
        <title>Buy Certified Gemstones Online | GemRishi India Trusted Astrology Gems</title>
        <meta name="description" content="Discover certified natural gemstones and astrology jewelry from GemRishi India. Trusted source for authentic gems, birthstones, and healing crystals." />
      </Helmet>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-green-25">
          <Header />
        </section>

        {/* Stones */}
        <section className="bg-white-50">
          <StoneCollection />
        </section>

        {/* Video section */}
        <section className="">
          <VideoSection />
        </section>

        {/* Jewellery */}
        <section className="bg-white">
          <JewelleryCollection />
        </section>

        {/* Legecy section */}
        <section className="bg-green-220 ">
          <Legacy />
        </section>

        {/* Legacy Trust */}
        <section className="bg-green-50">
          <LegacyTrust />
        </section>
{/* -------------------_Add By Pawan -------------------------------------------------------- */}
          <section className="bg-green-25">
            <SlideImage />
          </section>
{/* -------------------_Add By Pawan -------------------------------------------------------- */}

        {/* GemstoneEducationYoutubeSection section */}
        <section className="bg-green-220 ">
          <GemstoneEducationYoutubeSection />
        </section>

        <section>
          <GemstoneReviews />
        </section>

        {/* Trust Badges */}
        <section className="bg-green-100">
          <TrustBadges />
        </section>

        {/*
				Exclusive Jewellery
				<section className="bg-white border-b border-gray-200 ">
					<ExclusiveJewellery />
				</section> */}
      </div>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919817975978?text=Hello%20I%20want%20to%20know%20more%20about%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Glow Ring */}
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-70 blur-xl animate-pulse"></span>

          {/* Main Button */}
          <div
            className="relative bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.3)]
                    transform transition-all duration-300
                    hover:scale-110 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]
                    active:scale-95"
          >
            <FaWhatsapp size={28} />
          </div>
        </div>
      </a>
    </>
  );
}

export default Home;
