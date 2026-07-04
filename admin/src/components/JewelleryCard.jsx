import { motion } from "framer-motion";

const JewelleryCard = ({ item, onClick, variants }) => {
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
    <motion.div key={item._id} variants={variants}>
      <Card className="bg-white" onClick={() => onClick(item.slug)}>
        <CardContent className="p-4">
          <img
            src={item?.images?.[0]?.url || "/placeholder.svg"}
            alt={item?.jewelryName}
            className="w-auto h-auto object-contain"
          />
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">{item?.jewelryName}</h3>
            <p className="text-sm font-semibold text-gray-800">₹ {item.jewelryPrice}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JewelleryCard;
