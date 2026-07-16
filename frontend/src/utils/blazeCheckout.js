// Working
// let initialized = false;

// export const initBlaze = () => {

//   if (
//     !window.BlazeSDKWeb
//   ) {

//     console.error(
//       "SDK unavailable"
//     );

//     return;
//   }

//   window.BlazeSDKWeb.initiate(
//     {
//       requestId:
//         crypto.randomUUID(),

//       service:
//         "in.breeze.onecco",

//       payload: {
//         // action:
//         //   "initiate",

//         merchantId:
//           "gemrishi",

//         environment:
//           "smbRelease",

//         // integrationType:
//         //   "redirection",

//         shopUrl:
//         "https://gemrishi.com",
//       },
//     },

//     (response) => {

//       console.log(
//         "INIT RESPONSE:",
//         response
//       );
//     }
//   );
// };



import BlazeSDK from "@juspay/blaze-sdk-web";
import {
  getBreezeCheckoutContext,
  getFiredPaymentMethod,
  setFiredPaymentMethod,
  getFiredPurchase,
  setFiredPurchase,
} from "./breezeContext";
import { trackPurchaseEvent, buildItemsFromRawCart } from "./purchaseTracking";

let initialized = false;
// ==============================================================================

const pushDL = (event, ecommerce) => {
  try {
    console.log('[Breeze] pushDL called:', event);
    window.top.dataLayer = window.top.dataLayer || []; // ← also fix initialization
    window.top.dataLayer.push({ ecommerce: null });
    window.top.dataLayer.push({ event, ecommerce });
    console.log('[Breeze] pushDL success, length:', window.top.dataLayer.length);
  } catch (err) {
    console.error('[Breeze] pushDL error:', err); // ← this will reveal the actual problem
  }
};
// ==============================================================================
const handleBreezeEvent = (response) => {
  const eventName = response?.payload?.event;
  if (!eventName) return;

  const ctx = getBreezeCheckoutContext();

  switch (eventName) {
    case "ProcessStarted": {
      // Internal SDK lifecycle event, no GA4 equivalent.
      break;
    }

    case "InitiateCheckout": {
      const data = response.payload.data;
      pushDL("begin_checkout", {
        currency: data?.currency || "INR",
        value: data?.totalPrice || ctx?.finalAmount || 0,
        items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
      });
      break;
    }

    case "AddPaymentInfo": {
      const method = response.payload.data?.paymentMethodType;
      if (method && method !== getFiredPaymentMethod()) {
        setFiredPaymentMethod(method);
        pushDL("add_payment_info", {
          currency: "INR",
          value: ctx?.finalAmount || 0,
          payment_type: method,
          items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
        });
      }
      break;
    }

    case "PayNow": {
      const method = response.payload.paymentMethodType;
      if (method && method !== getFiredPaymentMethod()) {
        setFiredPaymentMethod(method);
        pushDL("add_payment_info", {
          currency: "INR",
          value: ctx?.finalAmount || 0,
          payment_type: method,
          items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
        });
      }
      break;
    }

    case "OrderComplete":
    case "Purchase": {
      if (!getFiredPurchase() && ctx) {
        setFiredPurchase(true);
        trackPurchaseEvent({
          orderId: ctx.order.orderId,
          subtotal: ctx.order.totalAmount,
          coupon: ctx.promoCode || "",
          items: buildItemsFromRawCart(ctx.cartData),
        });
      }
      break;
    }

    case "CheckoutFailed": {
      pushDL("checkout_failed", {
        currency: "INR",
        value: ctx?.finalAmount || 0,
        items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
      });
      break;
    }

    default: {
      console.log("Unhandled Breeze event:", eventName, response);
    }
  }
};

export const initBlaze = () => {
  try {
    if (initialized) return;

    BlazeSDK.initiate(
      {
        requestId: crypto.randomUUID(),

        service: "in.breeze.onecco",

        payload: {
          merchantId: "gemrishi",

          environment: "smbRelease",

          shopUrl: "https://gemrishi.com",
        },
      },

      (response) => {
        console.log("INIT RESPONSE:", response);

        initialized = true;

        // ===== Add By Pawan =============================================================
        handleBreezeEvent(response);
        // Add By Pawan ===================================================================
      }
    );
  } catch (err) {
    console.error("Blaze Init Error:", err);
  }
};

export default BlazeSDK;