"use client";

import { useState } from "react";
import security from "../../assets/DetailPage/security.svg";
import PaymentMethod from "../../assets/DetailPage/PaymentMethod.svg";
import ReturnPolicy from "../../assets/DetailPage/ReturnPolicy.svg";
import ShippingPolicy from "../../assets/DetailPage/ShippingPolicy.svg";
import { useParams } from "react-router-dom";
import { useGemstoneBySlug } from "../../hooks/usesinglegemstone";
import UserReview from "./UserReview";

function ProductDescription() {
  const { slug } = useParams();
  const { product, loading, error } = useGemstoneBySlug(slug);
  const [expanded, setExpanded] = useState(false);

  const fullText =
    product?.subCategory?.description ||
    "In the enchanting realm of precious gemstones lies a verdant masterpiece...";

  const maxLength = 450;

  // Only shorten if text is longer than maxLength
  const isLong = fullText.length > maxLength;

  const shortText = isLong ? fullText.slice(0, maxLength) + "..." : fullText;

  const Desc = {
    Items: [
      { Product: "Promoted Good Health", Image: security },
      { Product: "Stability in domestic life", Image: security },
      { Product: "Good for education", Image: security },
      { Product: "Financial Growth", Image: security },
    ],
  };

  return (
    <>
      <div className="w-full  h-auto px-4 lg:px-30">
        <div className="w-full lg:h-[70px] h-auto flex items-end justify-center py-4 lg:py-0">
          <h1 className="lg:text-[24px] text-xl  text-black text-center">
            Product Description
          </h1>
        </div>
        <div className="w-full lg:h-[70px] h-auto flex flex-col py-4 lg:py-12">
          <div
  className="
    grid grid-cols-2 lg:flex lg:flex-wrap 
    gap-4 lg:gap-0 mt-4 lg:mt-0
    w-full
  "
>
  {Desc.Items.map((item, index) => (
    <div
      key={item.Product + index}
      className={`
        lg:w-[25%] w-full h-full flex flex-row items-center 
        justify-start lg:items-end lg:justify-start gap-2
        ${index === 0 ? "" : "lg:pl-[22px]"}
      `}
    >
      <img
        src={item.Image || "/placeholder.svg"}
        alt={item.Product}
        className="lg:w-[20px] lg:h-[20px] w-4 h-4"
      />
      <p className="text-xs lg:text-sm font-bold text-gray-800 text-left">
        {item.Product}
      </p>
    </div>
  ))}
</div>

        </div>

        <div className="w-full  flex  py-8">
          <p className="lg:text-[18px] text-base text-gray-800 text-center lg:text-left">
            {expanded ? fullText : shortText}

            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#1EA0DC] ml-1 cursor-pointer"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </p>
        </div>
        {/* Gemstone Attributes */}
        <div className="w-full py-8">
          {/* Table for large screens */}
          <div className="hidden lg:block">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Gemstone
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.name}
                  </td>
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Origin
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.origin}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Weight (grams)
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.weight || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Carat
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.carat}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Treatment
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.treatment}
                  </td>
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Cut
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.cut}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Shape
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.shape}
                  </td>
                  <td className="py-3 px-4 text-[18px] font-semibold text-gray-900">
                    Colour
                  </td>
                  <td className="py-3 px-4 text-[18px] text-gray-600">
                    {product?.color}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile */}
          <div className="block lg:hidden">
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
              {[
                ["Gemstone", product?.name],
                ["Origin", product?.origin],
                ["Weight (grams)", product?.weight || "N/A"],
                ["Carat", product?.carat],
                ["Treatment", product?.treatment],
                ["Cut", product?.cut],
                ["Shape", product?.shape],
                ["Colour", product?.color],
              ].map(([label, value], i, arr) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-2 text-sm sm:text-base ${
                    i !== arr.length - 1 ? "border-b border-gray-300" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full  h-auto lg:px-10 px-4 py-8 mt-12 lg:py-0">
          <div className="w-full lg:h-[72px] h-auto flex justify-center mb-8 lg:mb-0">
            <h1 className="lg:text-[24px] text-xl  text-center">
              Things you want to know before purchase
            </h1>
          </div>
          <div className="w-full lg:h-[320px] h-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-[50px]">
            <div className="shadow-lg rounded-[10px] flex flex-col items-center justify-center py-6 lg:py-0">
              <div className="flex flex-col w-full lg:h-[40%] h-auto justify-center items-center mb-4 lg:mb-0">
                <img
                  src={ShippingPolicy || "/placeholder.svg"}
                  alt="ShippingPolicyImg"
                  className="lg:w-[70px] lg:h-[70px] w-12 h-12"
                />
                <h1 className="lg:text-[15px] text-sm font-bold  text-[#596CB2] pt-2">
                  Shipping Policy
                </h1>
              </div>
              <div className="w-full lg:h-[60%] h-auto flex justify-center items-center flex-col px-4 lg:px-0">
                <p className="lg:pr-18 pr-0 lg:text-[13px] text-xs text-gray-700  text-center lg:text-left">
                  Worldwide Shipping is available
                </p>
                <ul className="lg:w-[250px] w-full lg:h-[120px] h-auto list-disc pl-5 mt-2">
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    1. Free shipping on orders over INR 5,000 in India.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    2. COD is available for orders over INR 5,000 in India.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    3. International Express Shipping takes 4-7 days for
                    delivery.
                  </li>
                </ul>
                <div className="flex justify-center lg:w-[210px] w-full mt-2">
                  {/* <p className="lg:text-[13px] text-xs font-bold ">Know more</p> */}
                </div>
              </div>
            </div>
            <div className="shadow-lg rounded-[10px] flex flex-col items-center justify-center py-6 lg:py-0">
              <div className="flex flex-col w-full lg:h-[40%] h-auto justify-center items-center mb-4 lg:mb-0">
                <img
                  src={ReturnPolicy || "/placeholder.svg"}
                  alt="ReturnPolicyImg"
                  className="lg:w-[70px] lg:h-[70px] w-12 h-12"
                />
                <h1 className="lg:text-[15px] text-sm font-bold  text-[#BA5959] pt-2">
                  Return Policy
                </h1>
              </div>
              <div className="w-full lg:h-[60%] h-auto flex justify-center items-center flex-col px-4 lg:px-0">
                <p className="lg:pr-18 pr-0 lg:text-[13px] text-xs text-gray-700 "></p>
                <ul className="lg:w-[250px] w-full lg:h-[140px] h-auto list-disc pl-5 mt-2">
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    1. Get 100% moneyback on returning loose gemstones within 10
                    days for a full refund of the gemstone price.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    2. Return shipment is at customer's cost.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    3. Shipping/Charges, GST/VAT and duties are not refundable.
                  </li>
                </ul>
                <div className="flex justify-center lg:w-[210px] w-full mt-2">
                  {/* <p className="lg:text-[13px] text-xs font-bold ">Know more</p> */}
                </div>
              </div>
            </div>
            <div className="shadow-lg rounded-[10px] flex flex-col items-center justify-center py-6 lg:py-0">
              <div className="flex flex-col w-full lg:h-[40%] h-auto justify-center items-center mb-4 lg:mb-0">
                <img
                  src={PaymentMethod || "/placeholder.svg"}
                  alt="PaymentMethodImg"
                  className="lg:w-[70px] lg:h-[70px] w-12 h-12"
                />
                <h1 className="lg:text-[15px] text-sm font-bold  text-[#509E86] pt-2">
                  Payment Method
                </h1>
              </div>
              <div className="w-full lg:h-[60%] h-auto flex justify-center items-center flex-col px-4 lg:px-0">
                <p className="lg:pr-18 pr-0 lg:text-[13px] text-xs text-gray-700 "></p>
                <ul className="lg:w-[250px] w-full lg:h-[140px] h-auto list-disc pl-5 mt-2">
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    1. Credit Cards: All Visa, MasterCard and American Express
                    Credit Cards are accepted.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    2. Debit Cards (India):All Visa and Maestro debit Cards are
                    accepted.
                  </li>
                  <li className="lg:text-[13px] text-xs text-gray-700  mb-1">
                    3. Paypal, Net Banking, Cash Cards.
                  </li>
                </ul>
                <div className="flex justify-center lg:w-[210px] w-full mt-2">
                  {/* <p className="lg:text-[13px] text-xs font-bold ">Know more</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDescription;
