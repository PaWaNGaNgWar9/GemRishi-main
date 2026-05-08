let initialized = false;

export const initBlaze = () => {

  if (initialized) return;

  const checkSDK = setInterval(() => {

    if (window.BlazeSDK) {

      clearInterval(checkSDK);

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
    }

  }, 500);
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