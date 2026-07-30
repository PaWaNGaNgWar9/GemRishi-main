import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilteredCard from "./FilteredCard";

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

	// ---------------------------- Add By Pawan for 1,2,....last page (mobile) / 1,2,3,4....last page (desktop) ----------------------------
	const getVisiblePages = (firstCount) => {
		if (totalPages <= 1) return [];

		const siblingCount = 1;

		const shown = new Set();
		for (let i = 1; i <= Math.min(firstCount, totalPages); i++) shown.add(i);
		for (let i = Math.max(1, currentPage - siblingCount); i <= Math.min(totalPages, currentPage + siblingCount); i++) shown.add(i);
		shown.add(totalPages);

		const sorted = Array.from(shown).sort((a, b) => a - b);

		const pages = [];
		let prev = 0;
		sorted.forEach((page) => {
			if (prev && page - prev > 1) {
				pages.push(`ellipsis-${prev}`);
			}
			pages.push(page);
			prev = page;
		});

		return pages;
	};

	const visiblePagesMobile = getVisiblePages(2);   // 1,2....last
	const visiblePagesDesktop = getVisiblePages(4);  // 1,2,3,4....last
	// ---------------------------- End Add By Pawan for 1,2,....last / 1,2,3,4....last page ----------------------------

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
				<div className="flex flex-nowrap justify-center items-center gap-1.5 sm:gap-3 my-6 px-2 w-full">
					<button
						onClick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						className="shrink-0 p-2 border rounded-full disabled:opacity-50"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					{/* ---------------------------- Add By Pawan for 1,2,....last / 1,2,3,4....last page ---------------------------- */}
					{/* Mobile: 1,2....last */}
					<div className="flex sm:hidden gap-1 mx-1 overflow-x-auto scrollbar-hide">
						{visiblePagesMobile.map((page, idx) =>
							typeof page !== "number" ? (
								<span
									key={`m-${page}-${idx}`}
									className="px-2 py-1 text-sm font-semibold text-gray-400 select-none shrink-0"
								>
									...
								</span>
							) : (
								<button
									key={`m-${page}`}
									onClick={() => goToPage(page)}
									className={`px-3 py-1 rounded shrink-0 ${currentPage === page
										? "text-blue-600 font-semibold"
										: "text-gray-500 hover:text-blue-600"
										}`}
								>
									{page}
								</button>
							)
						)}
					</div>

					{/* Desktop: 1,2,3,4....last */}
					<div className="hidden sm:flex gap-2 mx-2">
						{visiblePagesDesktop.map((page, idx) =>
							typeof page !== "number" ? (
								<span
									key={`d-${page}-${idx}`}
									className="px-2 py-1 text-sm font-semibold text-gray-400 select-none shrink-0"
								>
									...
								</span>
							) : (
								<button
									key={`d-${page}`}
									onClick={() => goToPage(page)}
									className={`px-3 py-1 rounded shrink-0 ${currentPage === page
										? "text-blue-600 font-semibold"
										: "text-gray-500 hover:text-blue-600"
										}`}
								>
									{page}
								</button>
							)
						)}
					</div>
					{/* ---------------------------- End Add By Pawan for 1,2,....last / 1,2,3,4....last page ---------------------------- */}

					<button
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="shrink-0 p-2 border rounded-full disabled:opacity-50"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
};

export default GemstoneCard;