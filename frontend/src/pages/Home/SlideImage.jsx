import { useState, useEffect } from "react";

import bg1 from "../../assets/Slideimage/Sonam Bajwa 2.jpg.jpeg";
import bg2 from "../../assets/Slideimage/Rubina Dilaik 3.jpg.jpeg";
import bg3 from "../../assets/Slideimage/Bandaru Dattatraya.jpg.jpeg";
import bg4 from "../../assets/Slideimage/Karisma Kapoor.jpg.jpeg";
import bg5 from "../../assets/Slideimage/Rubina Dilaik 2.jpg.jpeg";
import bg6 from "../../assets/Slideimage/Mouni Roy.jpg.jpeg";
import bg7 from "../../assets/Slideimage/Malaika Arora.jpg.jpeg";
import bg8 from "../../assets/Slideimage/Arbaaz Khan.jpg.jpeg";
import bg9 from "../../assets/Slideimage/Sonam Bajwa.jpg.jpeg";
import bg10 from "../../assets/Slideimage/TiE CHANDIGARH.jpg.jpeg";

const images = [
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  bg7,
  bg8,
  bg9,
  bg10,
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  bg7,
  bg8,
  bg9,
  bg10,
];

export default function SlideImage() {
  const [current, setCurrent] = useState(0);

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isMobile ? 196 : 336;
  const centerOffset = isMobile ? 98 : 168;

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden py-5">

      {/* Background */}
      <div
        className="absolute inset-0 bg-contain bg-center transition-all duration-700 scale-100"
        style={{
          backgroundImage: `url(${images[current]})`,
        }}
      />

      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* Heading */}

        <div className="text-center mb-2">

          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold">
            Our Gallery
          </span>

          <h2 className="mt-1 text-sm font-bold md:text-xl font-serif text-white">
             Celebrating Excellence
          </h2>

          <p className=" text-white/70 w-full text-[7px] lg:text-[12px] mx-auto">
            Every photograph reflects our heritage, craftsmanship, and the
            trust we've built over generations.
          </p>

        </div>

        {/* Slider */}

        <div className="overflow-hidden">

          <div
            className="flex gap-2 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(50% - ${
                current * cardWidth
              }px - ${centerOffset}px))`,
            }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 transition-all duration-700 ${
                  index === current
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-50"
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className={`
                    object-cover
                    rounded-2xl
                    shadow-2xl
                    transition-all
                    duration-700

                    ${
                      isMobile
                        ? "w-[190px] h-[250px]"
                        : "w-[330px] h-[360px]"
                    }
                  `}
                />
              </div>
            ))}
          </div>

        </div>

        {/* Dots */}

        <div className="flex justify-center gap-1 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                current === i
                  ? "w-8 h-1 bg-[#1bafe0]"
                  : "w-1 h-1 bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
} 