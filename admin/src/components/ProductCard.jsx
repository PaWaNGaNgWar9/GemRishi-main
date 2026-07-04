import { motion } from "framer-motion";

export default function ProductCard({ product, onClick, variants }) {
  // Custom Card Components
  const Card = ({ children, className = "", ...props }) => {
    return (
      <div
        className={`rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };

  const CardContent = ({ children, className = "", ...props }) => {
    return (
      <div className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  };

  

  return (
    <motion.div key={product?._id} variants={variants}>
      <Card className="bg-white" onClick={() => onClick(product.slug)}>
        <CardContent className="p-4">
          <div className="relative flex justify-center items-center mb-4">
            <img
              src={product?.images?.[0]?.url || "/placeholder.svg"}
              alt={product?.name}
              className="w-auto h-auto object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">{product?.name}</h3>
            <p className="text-xs text-gray-500 mb-1">
              Origin: {product?.origin}
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {product?.price?.toLocaleString()} INR
            </p>
            {/* {product.series && (
              <p className="text-xs text-gray-400">{product.series}</p>
            )} */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
