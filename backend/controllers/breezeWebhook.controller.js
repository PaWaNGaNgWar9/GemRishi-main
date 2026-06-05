import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const breezeWebhook = async (req, res) => {
  try {

    console.log("========== BREEZE WEBHOOK ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.BREEZE_API_KEY) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const { id, eventName, content } = req.body;

    if (!content?.orderId) {
      return res.status(400).json({
        status: "error",
        message: "Order ID missing",
      });
    }

    const order = await Order.findOne({
      orderId: content.orderId,
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (
      eventName === "ORDER_SUCCEEDED" &&
      content.status === "SUCCESS"
    ) {

      order.paymentStatus = "Completed";
      order.orderStatus = "InProgress";
      order.breezeTransactionId = content.txnId;

      // Optional webhook data
      order.breezePaymentMethod =
        content.payment?.paymentMethod || null;

      order.breezePaymentType =
        content.payment?.paymentMethodType || null;

      order.breezeWebhookData = content;

      await order.save();

      const user = await User.findById(order.userId);

      if (user) {
        user.cart = [];
        await user.save();
      }
    }

    return res.status(200).json({
      id,
      status: "SUCCESS",
      content: {
        orderId: content.orderId,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};