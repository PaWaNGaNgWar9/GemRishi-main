
// import crypto from "crypto";
// import fs from "fs";
// import path from "path";

// export const signCart =
//   async (req, res) => {

//     try {

//       const breezeCart =
//         req.body.cart;

//       const cartString =
//         JSON.stringify(
//           breezeCart
//         );

//       const privateKey =
//         fs.readFileSync(
//           path.join(
//             process.cwd(),
//             "private-key.pem"
//           ),
//           "utf8"
//         );

//       const signer =
//         crypto.createSign(
//           "RSA-SHA256"
//         );

//       signer.update(
//         cartString
//       );

//       signer.end();

//       const signature =
//         signer.sign(
//           privateKey,
//           "base64"
//         );

//       return res.json({
//         success: true,

//         cart:
//           cartString,

//         signature,
//       });

//     } catch (err) {

//       console.error(err);

//       return res.status(500).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   };


import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const signCart = async (req, res) => {
  try {

    const breezeCart = req.body.cart;

    const cartString = JSON.stringify(breezeCart);

    const privateKey = fs.readFileSync(
      path.join(process.cwd(), "private-key.pem"),
      "utf8"
    );

    const signer = crypto.createSign("RSA-SHA256");

    signer.update(cartString, "utf8");
    signer.end();

    const signature = signer.sign(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      "base64"
    );

    return res.json({
      success: true,
      cart: cartString,
      signature,
    });

  } catch (err) {

    console.error("SIGN ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


export const platformWebhook = async (req, res) => {
  const payload = req.body;
  const { content } = payload;
  const breezeOrderId = content?.orderId || payload.id || "unknown";

  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.BREEZE_WEBHOOK_API_KEY) {
      console.warn("BREEZE WEBHOOK: Invalid or missing x-api-key");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("BREEZE WEBHOOK PAYLOAD:", JSON.stringify(payload, null, 2));

    const { eventName } = payload;

    if (eventName === "ORDER_SUCCEEDED" && content) {
      const { orderId, txnId, status, payment, shippingAddress, customer, cart } = content;

      const paymentStatusMap = {
        SUCCESS: "Completed",
        PENDING: "Pending",
        FAILED: "Failed",
      };

      const paymentMethodRaw = payment?.paymentMethod || "";
      const paymentMethod = paymentMethodRaw === "CASH" ? "cod" : "breeze";
      const paymentStatus = paymentStatusMap[status] || "Pending";

      // Only include productId if it's a valid MongoDB ObjectId (24 hex chars)
      const items = (cart?.items || []).map((item) => {
        const entry = {
          quantity: item.quantity || 1,
          itemTotal: item.finalPrice || item.initialPrice || 0,
        };
        if (item.id && /^[a-f\d]{24}$/i.test(item.id)) {
          entry.productId = item.id;
        }
        return entry;
      });

      const address = shippingAddress
        ? {
            fullName: shippingAddress.name || customer?.name,
            email: shippingAddress.emailAddress || customer?.emailAddress,
            mobileNo: shippingAddress.phoneNumber || customer?.phoneNumber,
            addressLine1: shippingAddress.line1,
            addressLine2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pinCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            addressType: shippingAddress.type || "Home",
          }
        : {};

      try {

        const existing = await Order.findOne({
          orderId: cart?.id,
        });


      if (!existing) {
        console.warn(
          "ORDER NOT FOUND:",
          cart?.id
        );

        return res.status(200).json({
          status: "SUCCESS",
        });
      }

      existing.paymentStatus = paymentStatus;
      existing.orderStatus = "Pending";
      existing.breezeTransactionId = txnId;

      existing.address = {
        fullName:
          shippingAddress?.name ||
          customer?.name ||
          "",

        email:
          customer?.emailAddress ||
          "",

        mobileNo:
          shippingAddress?.phoneNumber ||
          customer?.phoneNumber ||
          "",

        addressLine1:
          shippingAddress?.line1 || "",

        addressLine2:
          shippingAddress?.line2 || "",

        city:
          shippingAddress?.city || "",

        state:
          shippingAddress?.state || "",

        pinCode:
          shippingAddress?.postalCode || "",

        country:
          shippingAddress?.country || "India",

        addressType:
          shippingAddress?.type || "Home",
      };

      await existing.save();

      } catch (dbErr) {
        console.error("BREEZE WEBHOOK DB ERROR (non-fatal):", dbErr.message);
      }
    }

    return res.status(200).json({
      id: payload.id,
      status: "SUCCESS",
      message: "Order created successfully",
      content: {
        orderId: breezeOrderId,
      },
    });
  } catch (err) {
    console.error("BREEZE WEBHOOK ERROR:", err);
    return res.status(200).json({
      id: payload?.id || "unknown",
      status: "SUCCESS",
      message: "Order received",
      content: { orderId: breezeOrderId },
    });
  }
};


// export const platformWebhook = async (req, res) => {

//   const payload = req.body;
//   const { content } = payload;

//   const breezeOrderId =
//     content?.orderId ||
//     payload.id ||
//     "unknown";

//   try {

//     const apiKey =
//       req.headers["x-api-key"];

//     if (
//       !apiKey ||
//       apiKey !== process.env.BREEZE_WEBHOOK_API_KEY
//     ) {

//       console.warn(
//         "BREEZE WEBHOOK: Invalid or missing x-api-key"
//       );

//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     console.log(
//       "BREEZE WEBHOOK PAYLOAD:",
//       JSON.stringify(payload, null, 2)
//     );

//     const { eventName } = payload;

//     if (
//       eventName === "ORDER_SUCCEEDED" &&
//       content
//     ) {

//       const {
//         orderId,
//         txnId,
//         status,
//         payment,
//       } = content;

//       const paymentStatusMap = {
//         SUCCESS: "Completed",
//         PENDING: "Pending",
//         FAILED: "Failed",
//       };

//       const paymentMethodRaw =
//         payment?.paymentMethod || "";

//       const paymentMethod =
//         paymentMethodRaw === "CASH"
//           ? "cod"
//           : "breeze";

//       const paymentStatus =
//         paymentStatusMap[status] ||
//         "Pending";

//       try {

//         const existing =
//           await Order.findOne({
//             orderId,
//           });

//         if (!existing) {

//           console.log(
//             "BREEZE ORDER NOT FOUND:",
//             orderId
//           );

//           return res.status(200).json({
//             id: payload.id,
//             status: "SUCCESS",
//             message: "Order not found",
//             content: {
//               orderId,
//             },
//           });
//         }

//         existing.paymentStatus =
//           paymentStatus;

//         existing.paymentMethod =
//           paymentMethod;

//         if (
//           paymentStatus ===
//           "Completed"
//         ) {
//           existing.orderStatus =
//             "InProgress";
//         }

//         if (txnId) {
//           existing.breezeTransactionId =
//             txnId;
//         }

//         await existing.save();

//         console.log(
//           "BREEZE ORDER UPDATED:",
//           orderId
//         );

//         if (existing.userId) {

//           const user =
//             await User.findById(
//               existing.userId
//             );

//           if (user) {

//             user.cart = [];

//             await user.save();

//             console.log(
//               "USER CART CLEARED:",
//               user._id
//             );
//           }
//         }

//       } catch (dbErr) {

//         console.error(
//           "BREEZE WEBHOOK DB ERROR:",
//           dbErr
//         );
//       }
//     }

//     return res.status(200).json({
//       id: payload.id,
//       status: "SUCCESS",
//       message:
//         "Webhook processed successfully",
//       content: {
//         orderId: breezeOrderId,
//       },
//     });

//   } catch (err) {

//     console.error(
//       "BREEZE WEBHOOK ERROR:",
//       err
//     );

//     return res.status(200).json({
//       id: payload?.id || "unknown",
//       status: "SUCCESS",
//       message: "Order received",
//       content: {
//         orderId: breezeOrderId,
//       },
//     });
//   }
// };


