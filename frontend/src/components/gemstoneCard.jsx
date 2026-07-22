import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilteredCard from "./FilteredCard";
import { Pages } from "@mui/icons-material";

const GemstoneCard = ({ color, products }) => {
	const itemsPerPage = 8;
	const [currentPage, setCurrentPage] = useState(1);

	const safeProducts = Array.isArray(products) ? products : [];
	const normalizedColor = color?.trim().toLowerCase();

	const filteredProducts = useMemo(() => {
		if (!normalizedColor) return safeProducts;

		return safeProducts.filter((product) => {
			const productColor = product?.color || "";
			const normalizedProductColor = productColor.trim().toLowerCase();

			return normalizedProductColor.includes(normalizedColor);
		});
	}, [normalizedColor, safeProducts]);

	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
	const indexOfLast = currentPage * itemsPerPage;
	const indexOfFirst = indexOfLast - itemsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{currentProducts.length > 0 ? (
					currentProducts.map((product) => (
						<FilteredCard
							key={product._id}
							id={product._id}
							slug={product?.slug}
							image={product?.images?.[0]?.url || "/ring.png"}
							title={product.name}
							origin={product.origin}
							price={product.sellPrice || product.price}
							videos={product.videos}
						/>
					))
				) : (
					<p className="col-span-full text-center text-gray-500">
						⚠️ No {color || "filtered"} gemstones found.
					</p>
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-3 my-6">
					<button
						onClick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-2 border rounded-full disabled:opacity-50"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					{/* {[...Array(totalPages)].map((_, i) => (
						<button
							key={i + 1}
							onClick={() => goToPage(i + 1)}
							className={`px-3 py-1 rounded ${currentPage === i + 1
								? "text-blue-600 font-semibold"
								: "text-gray-500 hover:text-blue-600"
								}`}
						>
							{i + 1}
						</button>
					))} */}
{/* ----------------- Add By Pawan for (1,2,3....last page) ---------------------- */}
{(() => {
  const pages = [];
  pages.push(
    <button
      key={1}
      onClick={() => goToPage(1)}
      className={`px-3 py-1 rounded ${
        currentPage === 1
          ? "text-blue-600 font-semibold"
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      1
    </button>
  );
  if (currentPage > 3) {
    pages.push(
      <span key="leftDots" className="px-2">
        ...
      </span>
    );
  }
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(
      <button
        key={i}
        onClick={() => goToPage(i)}
        className={`px-3 py-1 rounded ${
          currentPage === i
            ? "text-blue-600 font-semibold"
            : "text-gray-500 hover:text-blue-600"
        }`}
      >
        {i}
      </button>
    );
  }

  // Right dots
  if (currentPage < totalPages - 2) {
    pages.push(
      <span key="rightDots" className="px-2">
        ...
      </span>
    );
  }

  // Last page
  if (totalPages > 1) {
    pages.push(
      <button
        key={totalPages}
        onClick={() => goToPage(totalPages)}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "text-blue-600 font-semibold"
            : "text-gray-500 hover:text-blue-600"
        }`}
      >
        {totalPages}
      </button>
    );
  }

  return pages;
})()}
{/* ------------------------------------------------------------------------------ */}

					<button
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="p-2 border rounded-full disabled:opacity-50"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
};

export default GemstoneCard;