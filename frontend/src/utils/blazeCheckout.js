import BlazeSDK from "@juspay/blaze-sdk-web";

let initialized = false;

export const initBlaze = () => {

  if (initialized) return;

  BlazeSDK.initiate(
    {
      requestId: "init_" + Date.now(),

      service: "in.breeze.onecco",

      payload: {
        merchantId: "gemrishi",
        shopUrl: window.location.origin,
        environment: "sandbox",
      },
    },

    (res) => {
      console.log("BLAZE INIT:", res);
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