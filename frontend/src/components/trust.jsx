import { Star } from "lucide-react";
import clientLogo1 from "../assets/client-logo-1.png";
import clientLogo2 from "../assets/client-logo-2.png";
import clientLogo3 from "../assets/client-logo-3.png";
import clientLogo4 from "../assets/client-logo-4.png";

export default function TrustBadges() {
  return (
    <div className="w-full px-4 py-3 md:py-4 flex flex-col items-center justify-center text-center">
      <h2 className="text-[#0B1D3A] text-2xl md:text-3xl font-semibold mb-3 md:mb-4">
        Reviews and Ratings
      </h2>

      <div className="w-full max-w-3xl bg-[#FFF7E8] rounded-[20px] p-4 sm:p-5 md:p-6 flex flex-col items-center gap-4 sm:gap-5 shadow-sm">
        {/* Title Pill */}
        <div className="bg-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-full shadow-sm text-sm sm:text-base md:text-lg text-gray-800 flex items-center justify-center text-center border border-gray-100 w-fit">
          <span>
            Trusted by{" "}
            <strong className="font-bold mx-1 text-black">1 Lakh+</strong>{" "}
            satisfied customers
          </span>
        </div>

        {/* Reviews Section */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10 md:gap-16">
          {/* Google Review */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <img
              src="/go.png"
              alt="Google Icon"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm bg-white"
            />
            <div className="text-left flex flex-col">
              <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                4.7
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[#FABB05] fill-[#FABB05] w-4 h-4 sm:w-5 sm:h-5"
                    />
                  ))}
                  <Star
                    size={16}
                    className="text-[#FABB05]/40 fill-[#FABB05]/40 w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
              </div>
              <p className="text-gray-600 text-[13px] sm:text-sm font-medium mt-1">
                7K+ Google Reviews
              </p>
            </div>
          </div>

          {/* Trustpilot Review */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
              <img
                src="/trust.png"
                alt="Trustpilot Icon"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              />
            </div>

            <div className="text-left flex flex-col">
              <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                4.4
                <div className="flex items-center gap-[2px]">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] bg-[#00B67A] rounded-sm"
                    ></div>
                  ))}
                  <div className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] bg-[#9DEDB8] rounded-sm"></div>
                </div>
              </div>

              <p className="text-gray-600 text-[13px] sm:text-sm font-medium mt-1">
                1K+ Trustpilot Reviews
              </p>
            </div>
          </div>
        </div>

        {/* --- UPGRADED: Identical Sized Cards --- */}
        <div className="w-full flex flex-col items-center mt-1 sm:mt-2 pt-4 sm:pt-5 border-t border-[#0B1D3A]/10">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-[0.15em] mb-4 sm:mb-5">
            A Shared Legacy of Excellence
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5">
            {/* Logo 1 (Mandala) - Zoomed */}
            {/* Fixed width/height enforces identical card size */}
            <div className="bg-white w-[130px] h-[75px] sm:w-[150px] sm:h-[85px] md:w-[160px] md:h-[90px] rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <img
                src={clientLogo1}
                alt="Client Logo 1"
                className="w-full h-full object-contain mix-blend-darken scale-[1.4]"
              />
            </div>

            {/* Logo 2 (Fateh Chand) - Standard Size */}
            <div className="bg-white w-[130px] h-[75px] sm:w-[150px] sm:h-[85px] md:w-[160px] md:h-[90px] rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <img
                src={clientLogo2}
                alt="Client Logo 2"
                className="w-[85%] h-[85%] object-contain mix-blend-darken"
              />
            </div>

            {/* Logo 3 (Neesh) - Zoomed */}
            <div className="bg-white w-[130px] h-[75px] sm:w-[150px] sm:h-[85px] md:w-[160px] md:h-[90px] rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <img
                src={clientLogo3}
                alt="Client Logo 3"
                className="w-full h-full object-contain mix-blend-darken scale-[1.6]"
              />
            </div>

            {/* Logo 4 (New) - Zoomed */}
            <div className="bg-white w-[130px] h-[75px] sm:w-[150px] sm:h-[85px] md:w-[160px] md:h-[90px] rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <img
                src={clientLogo4}
                alt="Client Logo 4"
                className="w-full h-full object-contain mix-blend-darken scale-[0.8]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
