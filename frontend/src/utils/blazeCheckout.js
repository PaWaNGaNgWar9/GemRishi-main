import BlazeSDK from "@juspay/blaze-sdk-web";
import {
  getBreezeCheckoutContext,
  getFiredPaymentMethod,
  setFiredPaymentMethod,
  getFiredPurchase,
  setFiredPurchase,
  getFiredAddress,
   setFiredAddress,
} from "./breezeContext";
import { trackPurchaseEvent, buildItemsFromRawCart } from "./purchaseTracking";

let initialized = false;

const pushDL = (event, ecommerce) => {
  try {
    console.log("[Breeze] pushDL called:", event);
    window.top.dataLayer = window.top.dataLayer || [];
    window.top.dataLayer.push({ ecommerce: null });
    window.top.dataLayer.push({ event, ecommerce });
    console.log("[Breeze] pushDL success, length:", window.top.dataLayer.length);
  } catch (err) {
    console.error("[Breeze] pushDL error:", err);
  }
};

const handleBreezeEvent = (response) => {
 console.log('[Breeze] ENTRY response:', JSON.stringify(response));

  const eventName = response?.payload?.event;
  if (!eventName) return;

  const ctx = getBreezeCheckoutContext();

  switch (eventName) {
    case "ProcessStarted": {
      break;
    }

    case "InitiateCheckout": {
      console.log("[Breeze] case hit, ctx:", ctx);

      const data = response.payload.data;

      try {
        pushDL("begin_checkout", {
          currency: data?.currency || "INR",
          value: data?.totalPrice || ctx?.finalAmount || 0,
          items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
        });
      } catch (e) {
        console.error("[Breeze] InitiateCheckout error:", e);
      }

      break;
    }


 case "AddPaymentInfo": {
  const data = response.payload.data;
  const userDetails = data?.userDetails;
  if (userDetails?.address && !getFiredAddress()) {
    setFiredAddress(true);
    console.log("[Breeze] Address available in AddPaymentInfo", userDetails);
    pushDL("add_shipping_info", {
      currency: "INR",
      value: ctx?.finalAmount || 0,
      items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
      address: {
        city: userDetails.city || "",
        state: userDetails.state || "",
        pinCode: userDetails.postalCode || "",
        country: "India",
      },
    });
  }

  console.log("[Breeze] AddPaymentInfo -> firing add_payment_info (page shown)");
  pushDL("AddPaymentInfo", {
    currency: "INR",
    value: ctx?.finalAmount || 0,
    payment_type: "unknown",
    items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
  });

  break;
}

    case "PayNow": {
      const method = response.payload.paymentMethodType;

      if (method && method !== getFiredPaymentMethod()) {
        setFiredPaymentMethod(method);

        pushDL("PayNow", {
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

        try {
        const parsed = typeof response === "string" ? JSON.parse(response) : response;
          handleBreezeEvent(parsed);
        } catch (e) {
          console.error("[Breeze] handleBreezeEvent threw:", e);
        }
      }
    );
  } catch (err) {
    console.error("Blaze Init Error:", err);
  }
};
export default BlazeSDK;