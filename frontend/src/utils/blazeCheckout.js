import BlazeSDK from "@juspay/blaze-sdk-web";

let initialized = false;

export const initBlaze = () => {

  if (initialized) return;

  if (!window.BlazeSDK) {
    console.error("BlazeSDK not loaded");
    return;
  }

  window.BlazeSDK.initiate(
    {
      requestId: "init_" + Date.now(),

      service: "in.breeze.onecco",

      payload: {
        merchantId: "gemrishi",

        env: "release",

        shopUrl: "https://gemrishi.com",
      },
    },

    (response) => {
      console.log("BLAZE INIT:", response);
    }
  );

  initialized = true;
};

export const openBlazeCheckout = ({
  cart,
  signature,
}) => {

  BlazeSDK.process({
    requestId: "process_" + Date.now(),

    service: "in.breeze.onecco",

    payload: {
      action: "startPayment",
      cart,
      signature,
    },
  });
};