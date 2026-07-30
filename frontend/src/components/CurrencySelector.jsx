import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "../redux/currencySlice";

const options = [
  { label: "India", currency: "INR" },
  { label: "USA", currency: "USD" },
  { label: "UK", currency: "GBP" },
  { label: "UAE", currency: "AED" },
  { label: "Australia", currency: "AUD" },
  { label: "Canada", currency: "CAD" },
  { label: "Germany", currency: "EUR" },
];

const CurrencySelector = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency.currency);

  return (
    <select
      value={currency}
      onChange={(e) => dispatch(setCurrency(e.target.value))}
      className="lg:text-sm text-[10px] text-black hover:text-cyan-700 font-bold bg-transparent rounded border border-gray-300 lg:px-2 px-1 py-1"
    >
      {options.map((opt) => (
        <option
          key={opt.currency}
          value={opt.currency}
          className="py-2"
        >
          {opt.label} ({opt.currency})
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;