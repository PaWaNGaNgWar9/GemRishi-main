let initialized = false;

export const initBlaze = async () => {

  if (initialized) return;

  // LOAD SDK DYNAMICALLY

  if (!window.BlazeSDK) {

    await new Promise((resolve, reject) => {

      const script =
        document.createElement("script");

      script.src =
        "https://sdk.breeze.in/packages/blaze/0.1.0/cdn.js";

      script.async = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        reject(
          new Error("SDK failed to load")
        );
      };

      document.body.appendChild(script);
    });
  }

  // CHECK AGAIN

  if (!window.BlazeSDK) {
    console.error("BlazeSDK missing");
    return;
  }

  // INITIATE

  window.BlazeSDK.initiate(
    {
      requestId: "init_" + Date.now(),

      service: "in.breeze.onecco",

      payload: {
        action: "initiate",

        merchantId: "gemrishi",

        environment: "production",

        integrationType: "redirection",
      },
    },

    (response) => {
      console.log(
        "BLAZE INIT:",
        response
      );
    }
  );

  initialized = true;
};

export const openBlazeCheckout = ({
  cart,
  signature,
}) => {

  if (!window.BlazeSDK) {
    console.error("BlazeSDK missing");
    return;
  }

  window.BlazeSDK.process({
    requestId: "process_" + Date.now(),

    service: "in.breeze.onecco",

    payload: {
      action: "startPayment",

      cart,

      signature,
    },
  });
};