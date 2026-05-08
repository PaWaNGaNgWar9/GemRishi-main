// let initialized = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   // WAIT UNTIL SDK LOADS

//   const interval = setInterval(() => {

//     if (window.BlazeSDK) {

//       clearInterval(interval);

//       window.BlazeSDK.initiate(
//         {
//           requestId: "init_" + Date.now(),

//           service: "in.breeze.onecco",

//           payload: {
//             action: "initiate",

//             merchantId: "gemrishi",

//             environment: "production",

//             integrationType: "redirection",
//           },
//         },

//         (response) => {
//           console.log(
//             "BLAZE INIT:",
//             response
//           );
//         }
//       );

//       initialized = true;
//     }

//   }, 300);
// };

// export const openBlazeCheckout = ({
//   cart,
//   signature,
// }) => {

//   if (!window.BlazeSDK) {
//     console.error("BlazeSDK missing");
//     return;
//   }

//   window.BlazeSDK.process({
//     requestId: "process_" + Date.now(),

//     service: "in.breeze.onecco",

//     payload: {
//       action: "startPayment",

//       cart,

//       signature,
//     },
//   });
// };




// let initialized = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   const interval = setInterval(() => {

//     if (window.BlazeSDK) {

//       clearInterval(interval);

//       window.BlazeSDK.initiate(
//         {
//           requestId: "init_" + Date.now(),

//           service: "in.breeze.onecco",

//           payload: {
//             action: "initiate",

//             merchantId: "gemrishi",

//             environment: "production",

//             integrationType: "redirection",
//           },
//         },

//         (response) => {
//           console.log(
//             "BLAZE INIT:",
//             response
//           );
//         }
//       );

//       initialized = true;
//     }

//   }, 300);
// };

// export const openBlazeCheckout = ({
//   cart,
//   signature,
// }) => {

//   if (!window.BlazeSDK) {
//     console.error("BlazeSDK missing");
//     return;
//   }

//   window.BlazeSDK.process({
//     requestId: "process_" + Date.now(),

//     service: "in.breeze.onecco",

//     payload: {
//       action: "startPayment",

//       cart,

//       signature,
//     },
//   });
// };



// import BlazeSDK from "@juspay/blaze-sdk-web";

// let initialized = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   BlazeSDK.initiate(
//     {
//       requestId: "init_" + Date.now(),

//       service: "in.breeze.onecco",

//       payload: {
//         merchantId: "gemrishi",

//         env: "release",

//         shopUrl: "https://gemrishi.com",
//       },
//     },

//     (response) => {
//       console.log(
//         "BLAZE INIT:",
//         response
//       );
//     }
//   );

//   initialized = true;
// };

// export const openBlazeCheckout = ({
//   cart,
//   signature,
// }) => {

//   BlazeSDK.process({
//     requestId: "process_" + Date.now(),

//     service: "in.breeze.onecco",

//     payload: {
//       action: "startPayment",

//       cart,

//       signature,
//     },
//   });
// };


let initialized = false;

export const initBlaze = () => {

  if (initialized) return;

  const interval = setInterval(() => {

    if (window.BlazeSDK) {

      clearInterval(interval);

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
          console.log(
            "BLAZE INIT:",
            JSON.stringify(response)
          );
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

  window.BlazeSDK.process(
    {
      requestId: "process_" + Date.now(),

      service: "in.breeze.onecco",

      payload: {
        action: "startPayment",

        cart,

        signature,

        merchantId: "gemrishi",

        env: "release",

        shopUrl: "https://gemrishi.com",
      },
    },

    (response) => {
      console.log(
        "PROCESS RESPONSE:",
        JSON.stringify(response)
      );
    }
  );
};

