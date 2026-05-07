import BlazeSDK from "@juspay/blaze-sdk-web";

export const startBlazeCheckout = (amount) => {
  BlazeSDK.initiate(
    {
      requestId: "init_" + Date.now(),
      service: "in.breeze.onecco",
      payload: {
        merchantId: "gemrishi", // 🔴 change later
        shopUrl: window.location.origin,
        environment: "sandbox",
      },
    },
    (res) => {
      console.log("INIT:", res);
    }
  );

  BlazeSDK.process({
    requestId: "process_" + Date.now(),
    service: "in.breeze.onecco",
    payload: {
      action: "startPayment",

      amount: amount * 100,
      currency: "INR",

      customer: {
        id: "guest_" + Date.now(),
        email: "test@test.com",
        phone: "9999999999",
      },

      order: {
        id: "order_" + Date.now(),
        description: "Test Order",
      },
    },
  });
};