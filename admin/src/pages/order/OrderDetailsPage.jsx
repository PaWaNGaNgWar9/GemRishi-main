import {
  ArrowLeft,
  Package,
  User,
  CreditCard,
  Truck,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import Navbar from "../../components/Navbar";
import UpperBar from "../../components/UpperBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} from "../../features/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OrderDetailsSkeleton from "../../skeletons/OrderDetailsSkeleton";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 p-1 rounded-lg",
  InProgress: "bg-blue-100 text-blue-800 border-blue-200 p-1 rounded-lg",
  shipped: "bg-purple-100 text-purple-800 border-purple-200 p-1 rounded-lg",
  Completed: "bg-green-100 text-green-800 border-green-200 p-1 rounded-lg",
  Cancelled: "bg-red-100 text-red-800 border-red-200 p-1 rounded-lg",
  Failed: "bg-red-100 text-red-800 border-red-200 p-1 rounded-lg",
};

export const OrderDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [status, setStatus] = useState("select status");
  const [paymentStatus, setPaymentStatus] = useState("select payment status");
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useGetSingleOrderQuery(orderId);

  const [updateOrder, { isLoading: updateOrderLoading }] =
    useUpdateOrderMutation();

  const order = orderData?.order;
  console.log("order", order)

  const handleUpdate = async () => {
    setOpen(false);

    try {
      await updateOrder({
        orderId: order._id,
        orderStatus: status,
      }).unwrap();

      toast.success("Order Updated Successfully");
    } catch (error) {
      toast.error(
        error?.data?.msg ||
          error?.data?.message ||
          error?.error ||
          "Something went wrong"
      );
    }
  };

  const handlePaymentUpdate = async () => {
    setOpenPayment(false);

    try {
      await updateOrder({
        orderId: order._id,
        paymentStatus: paymentStatus,
      }).unwrap();

      toast.success("Order Updated Successfully");
    } catch (error) {
      toast.error(
        error?.data?.msg ||
          error?.data?.message ||
          error?.error ||
          "Something went wrong"
      );
    }
  };

  const labelMap = {
    certificateType: "Certificate Type",
    price: "Price",
    weight: "Gemstone weight",
    karatType: "Karat",
    sizeType: "Sizetype",
    sizeNumber: "Size Number",
  };

  if (orderLoading) return <OrderDetailsSkeleton />;
  if (orderError) return <p>Something went wrong</p>;
  if (!order) return <p>No order found</p>;

  if (!order) {
    return (
      <div className="bg-white rounded-[30px] p-8 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-[#120213] mb-2">
            Order Not Found
          </h2>
          <p className="text-[#304c57] opacity-60 mb-4">
            The requested order could not be found.
          </p>
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusLabelMap = {
    InProgress: "In Progress",
    Pending: "Pending",
    Completed: "Completed",
    Cancelled: "Cancelled",
    Failed: "Failed",
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (orderLoading) return <OrderDetailsSkeleton />;
  if (orderError) return <p>Something went wrong</p>;
  if (!order) return <p>No order found</p>;
  return (
    <div className="w-full flex flex-row min-h-screen bg-gray-100">
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-[230px] z-50 bg-white border-r border-gray-200">
        <Navbar
          isSidebarOpen={true}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
            onClick={closeSidebar}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-[230px] bg-white border-r border-gray-200 lg:hidden"
          >
            <Navbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              closeSidebar={closeSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full lg:ml-[230px] lg:w-[calc(100%-230px)] flex flex-col relative z-10">
        <div className="w-full sticky top-0 z-20">
          <UpperBar toggleSidebar={toggleSidebar} />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="p-2 cursor-pointer"
                onClick={() => navigate("/orders")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#120213]">
                  Order #{order?.orderId}
                </h1>
                <p className="text-[#304c57] opacity-60">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`inline-block text-sm font-medium ${
                  statusColors[order.orderStatus] ||
                  "bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded"
                }`}
              >
                {statusLabelMap[order.orderStatus] || order.orderStatus}
              </p>
              <Button
                className="bg-[rgba(64,137,75,0.1)] text-[#329141] hover:bg-[rgba(64,137,75,0.2)] border-0"
                onClick={() => setOpen(true)}
              >
                Update Status
              </Button>
              <Button
                className="bg-[rgba(64,137,75,0.1)] text-[#329141] hover:bg-[rgba(64,137,75,0.2)] border-0"
                onClick={() => setOpenPayment(true)}
              >
                Update Payment Status
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order?.items.map((item) => {
                      const data = item?.productId || item?.jewelryId; // pick whichever is available

                      return (
                        <div
                          key={item._id}
                          className="flex flex-col gap-2 p-4 border border-[rgba(18,2,19,0.1)] rounded-lg"
                        >
                          {/* Top Row */}
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              {data?.images?.[0]?.url ? (
                                <img
                                  src={data.images[0].url}
                                  alt={data.name || data.jewelryName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="font-medium text-[#120213]">
                                {data?.name || data?.jewelryName || "Unnamed"}
                              </h4>
                              <p className="text-sm text-[#304c57] opacity-60">
                                SKU: {data?.sku || "NA"}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-medium text-[#120213]">
                                Qty: {item?.quantity || "NA"}
                              </p>
                              <p className="text-sm text-[#304c57]">
                                Rs. {data?.price || data?.jewelryPrice || "0"}
                              </p>
                            </div>
                          </div>

                          {item?.customization?.jewelryId && (
                            <div className="font-semibold text-xl">
                              Jewellery:{" "}
                              {item?.customization?.jewelryId?.jewelryName}
                            </div>
                          )}

                          {/* Customization Section */}
                          {item?.customization?.certificate && (
                            <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                              <p className="font-medium text-[#120213]">
                                Customization:
                              </p>
                              <ul className="list-disc ml-5 space-y-1">
                                {Object.entries(
                                  item.customization.certificate
                                ).map(([key, value]) => (
                                  <li key={key}>
                                    <span className="font-medium">
                                      {labelMap[key] || key}:
                                    </span>{" "}
                                    {value}
                                  </li>
                                ))}
                              </ul>
                              {item?.customization?.gemstoneWeight && (
                                <ul className="list-disc ml-5 space-y-1">
                                  {Object.entries(
                                    item.customization.gemstoneWeight
                                  ).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {labelMap[key] || key}:
                                      </span>{" "}
                                      {value}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {item?.customization?.goldKarat && (
                                <ul className="list-disc ml-5 space-y-1">
                                  {Object.entries(
                                    item.customization.goldKarat
                                  ).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {labelMap[key] || key}:
                                      </span>{" "}
                                      {value}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {item?.customization?.sizeSystem && (
                                <ul className="list-disc ml-5 space-y-1">
                                  {Object.entries(
                                    item.customization.sizeSystem
                                  ).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {labelMap[key] || key}:
                                      </span>{" "}
                                      {value}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {item?.customization?.diamondSubstitute && (
                                <ul className="list-disc ml-5 space-y-1">
                                  {Object.entries(
                                    item.customization.diamondSubstitute
                                  ).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {labelMap[key] || key}:
                                      </span>{" "}
                                      {value}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {item?.customization?.quality && (
                                <ul className="list-disc ml-5 space-y-1">
                                  {Object.entries(
                                    item.customization.quality
                                  ).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {labelMap[key] || key}:
                                      </span>{" "}
                                      {value}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                          <span className="text-[#304c57]">Subtotal</span>
                        <div className="flex justify-end text-sm">
                          {order.offlinePayAmount !== 0 && (<><span className="text-[#304c57]">Offline payment Amount: </span>
                          <p className="ml-2">Rs. {order.offlinePayAmount}</p>
                          </>)}
                          <span className="text-[#120213] ml-2">
                            Rs. {order.totalAmount} (Total Amount)
                          </span>
                        </div>

                        <Separator />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-3 h-3 bg-[#329141] rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-[#120213]">
                          {order?.orderStatus}
                        </h4>
                        <div className="text-sm text-[#304c57]">
                          {order?.address && (
                            <div>
                              <p>
                                <strong>Name:</strong> {order.address.fullName}
                              </p>
                              <p>
                                <strong>Email:</strong> {order.address.email}
                              </p>
                              <p>
                                <strong>Mobile:</strong>{" "}
                                {order.address.mobileNo}
                              </p>
                            </div>
                          )}

                          <p>
                            {order?.userId?.country ||
                              order?.retailerId?.country ||
                              "N/A"}
                          </p>
                        </div>

                        <p className="text-xs text-[#304c57] opacity-40 mt-1">
                          {new Date(order?.createdAt).toLocaleString() || "N/A"}
                        </p>
                        <p>
                          {order?.cancelOrderReason && (
                            <div className="mt-2 text-red-600">
                                Cancellation Reason:  {order.cancelOrderReason}
                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-[#120213]">
                      {order?.userId?.fullName ||
                        order?.retailerId?.fullName ||
                        "N/A"}
                    </p>
                    <p className="text-sm text-[#304c57] opacity-60">
                      {order?.userId?.email ||
                        order?.retailerId?.email ||
                        "N/A"}
                    </p>
                    <p className="text-sm text-[#304c57] opacity-60">
                      {order?.userId?.mobileNo ||
                        order?.retailerId?.mobileNo ||
                        "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-[#120213] mb-2">
                      {order?.userId?.fullName ||
                        order?.retailerId?.fullName ||
                        "N/A"}
                    </p>
                    <div className="text-sm text-[#304c57]">
                      {order?.address && (
                        <div>
                          <p>
                            <strong>Type:</strong> {order.address.addressType}
                          </p>
                          <p>
                            <strong>Name:</strong> {order.address.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.address.email}
                          </p>
                          <p>
                            <strong>Mobile:</strong> {order.address.mobileNo}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {order.address.addressLine1},{" "}
                            {order.address.addressLine2}
                          </p>
                          <p>
                            <strong>City:</strong> {order.address.city} -{" "}
                            {order.address.pinCode}
                          </p>
                          <p>
                            <strong>State:</strong> {order.address.state}
                          </p>
                          <p>
                            <strong>Country:</strong> {order.address.country}
                          </p>
                        </div>
                      )}

                      <p>
                        {order?.userId?.country ||
                          order?.retailerId?.country ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <p className="font-medium text-[#120213]">
                      {order?.paymentMethod}
                    </p>
                    <p className="text-sm text-[#304c57] opacity-60">
                      {order?.breezeTransactionId ||
                        order?.razorpayOrderId ||
                        "Transaction ID missing"}
                    </p>
                    <p
                      className={`inline-block text-sm font-medium ${
                        statusColors[order.paymentStatus] ||
                        "bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded"
                      }`}
                    >
                      {order?.paymentStatus}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>

            {/* Select Dropdown */}
            <select
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            >
              <option value="" disabled selected>
                Select status
              </option>
              <option value="InProgress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {updateOrderLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {openPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Update Payment Status
            </h2>

            {/* Select Dropdown */}
            <select
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            >
              <option value="" disabled selected>
                Select status
              </option>
              <option value="InProgress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenPayment(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
