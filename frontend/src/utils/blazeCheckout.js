import BlazeSDK from "@juspay/blaze-sdk-web";
import {
  getBreezeCheckoutContext,
  getFiredPaymentMethod,      // still used for AddPaymentInfo
  setFiredPaymentMethod,
  getFiredPayNowMethod,       // NEW - separate flag for PayNow
  setFiredPayNowMethod,       // NEW
  getFiredPurchase,
  setFiredPurchase,
  getFiredAddress,            // NEW - dedupe for AddedAddress
  setFiredAddress,            // NEW
} from "./breezeContext";
import { trackPurchaseEvent, buildItemsFromRawCart } from "./purchaseTracking";

let initialized = false;

const pushDL = (event, ecommerce) => {
  try {
    console.log("[Breeze] pushDL called:", event, ecommerce);
    window.top.dataLayer = window.top.dataLayer || [];
    window.top.dataLayer.push({ ecommerce: null });
    window.top.dataLayer.push({ event, ecommerce });
    console.log("[Breeze] pushDL success, length:", window.top.dataLayer.length);
  } catch (err) {
    console.error("[Breeze] pushDL error:", err);
  }
};

// helper: pull paymentMethodType regardless of whether it's nested under .data or not
const extractPaymentMethod = (payload) =>
  payload?.data?.paymentMethodType ?? payload?.paymentMethodType ?? null;

const handleBreezeEvent = (response) => {
  console.log("[Breeze] ENTRY response:", JSON.stringify(response));

  const eventName = response?.payload?.event;
  if (!eventName) {
    console.warn("[Breeze] No event name found on response, skipping");
    return;
  }

  const ctx = getBreezeCheckoutContext();
  console.log("[Breeze] eventName:", eventName, "ctx present:", !!ctx);

  switch (eventName) {
    case "ProcessStarted": {
      break;
    }

    case "InitiateCheckout": {
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

    // NEW: AddedAddress
    case "AddedAddress": {
      try {
        const data = response.payload.data ?? response.payload;
        console.log("[Breeze] AddedAddress data:", data);

        if (!getFiredAddress()) {
          setFiredAddress(true);

          pushDL("add_shipping_info", {
            currency: data?.currency || "INR",
            value: data?.totalPrice || ctx?.finalAmount || 0,
            // adjust these field names once you confirm actual payload shape
            shipping_tier: data?.shippingMethod || data?.deliveryType || "",
            address: {
              city: data?.address?.city || data?.city || "",
              state: data?.address?.state || data?.state || "",
              pincode: data?.address?.pincode || data?.pincode || "",
            },
            items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
          });
        } else {
          console.log("[Breeze] AddedAddress skipped, already fired");
        }
      } catch (e) {
        console.error("[Breeze] AddedAddress error:", e);
      }
      break;
    }

    case "AddPaymentInfo": {
      const method = extractPaymentMethod(response.payload);
      console.log("[Breeze] AddPaymentInfo method:", method, "already fired:", getFiredPaymentMethod());

      if (!method) {
        console.warn("[Breeze] AddPaymentInfo fired but no paymentMethodType found in payload");
        break;
      }

      if (method !== getFiredPaymentMethod()) {
        setFiredPaymentMethod(method);

        pushDL("add_payment_info", {
          currency: "INR",
          value: ctx?.finalAmount || 0,
          payment_type: method,
          items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
        });
      } else {
        console.log("[Breeze] AddPaymentInfo skipped, method already fired:", method);
      }
      break;
    }

    case "PayNow": {
      const method = extractPaymentMethod(response.payload);
      console.log("[Breeze] PayNow method:", method);

      if (!method) {
        console.warn("[Breeze] PayNow fired but no paymentMethodType found in payload");
        break;
      }

      if (method !== getFiredPayNowMethod()) {
        setFiredPayNowMethod(method);

        pushDL("PayNow", {
          currency: "INR",
          value: ctx?.finalAmount || 0,
          payment_type: method,
          items: ctx ? buildItemsFromRawCart(ctx.cartData) : [],
        });
      } else {
        console.log("[Breeze] PayNow skipped, method already fired:", method);
      }
      break;
    }

    case "OrderComplete":
    case "Purchase": {
      if (getFiredPurchase()) {
        console.log("[Breeze] Purchase skipped, already fired");
        break;
      }
      if (!ctx) {
        console.warn("[Breeze] Purchase skipped, ctx missing at fire time");
        break;
      }

      setFiredPurchase(true);
      trackPurchaseEvent({
        orderId: ctx.order.orderId,
        subtotal: ctx.order.totalAmount,
        coupon: ctx.promoCode || "",
        items: buildItemsFromRawCart(ctx.cartData),
      });
      break;
    }

    default: {
      console.log("[Breeze] Unhandled event:", eventName, response.payload);
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