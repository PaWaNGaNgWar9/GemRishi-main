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
//             merchantId: "gemrishi",

//             env: "release",

//             shopUrl: "https://gemrishi.com",
//           },
//         },

//         (response) => {
//           console.log(
//             "BLAZE INIT:",
//             JSON.stringify(response)
//           );
//         }
//       );

//       initialized = true;
//     }

//   }, 500);
// };

// export const openBlazeCheckout = ({
//   cart,
//   signature,
// }) => {

//   if (!window.BlazeSDK) {
//     console.error("BlazeSDK missing");
//     return;
//   }

//   window.BlazeSDK.process(
//     {
//       requestId: "process_" + Date.now(),

//       service: "in.breeze.onecco",

//       payload: {
//         action: "startPayment",

//         cart,

//         signature,

//         merchantId: "gemrishi",

//         env: "release",

//         shopUrl: "https://gemrishi.com",
//       },
//     },

//     (response) => {
//       console.log(
//         "PROCESS RESPONSE:",
//         JSON.stringify(response)
//       );
//     }
//   );
// };


// let initialized = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   const interval = setInterval(() => {

//     // IMPORTANT

//     if (
//       window.BlazeSDK &&
//       typeof window.BlazeSDK.initiate === "function"
//     ) {

//       clearInterval(interval);

//       console.log(
//         "SDK LOADED:",
//         window.BlazeSDK
//       );

//       window.BlazeSDK.initiate(
//         {
//           requestId: "init_" + Date.now(),

//           service: "in.breeze.onecco",

//           payload: {
//             merchantId: "gemrishi",

//             env: "release",

//             shopUrl:
//               "https://gemrishi.com",
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

//   }, 500);
// };

// export const openBlazeCheckout = async ({
//   cart,
//   signature,
// }) => {

//   // WAIT FOR SDK

//   let retries = 0;

//   while (
//     (
//       !window.BlazeSDK ||
//       typeof window.BlazeSDK.process !==
//         "function"
//     ) &&
//     retries < 20
//   ) {

//     console.log(
//       "Waiting for BlazeSDK..."
//     );

//     await new Promise((resolve) =>
//       setTimeout(resolve, 500)
//     );

//     retries++;
//   }

//   // FINAL CHECK

//   if (
//     !window.BlazeSDK ||
//     typeof window.BlazeSDK.process !==
//       "function"
//   ) {

//     console.error(
//       "BlazeSDK process missing"
//     );

//     return;
//   }

//   console.log(
//     "PROCESSING PAYMENT..."
//   );

//   window.BlazeSDK.process(
//     {
//       requestId:
//         "process_" + Date.now(),

//       service: "in.breeze.onecco",

//       payload: {
//         action: "startPayment",

//         merchantId: "gemrishi",

//         env: "release",

//         shopUrl:
//           "https://gemrishi.com",

//         cart,

//         signature,
//       },
//     },

//     (response) => {

//       console.log(
//         "PROCESS RESPONSE:",
//         response
//       );
//     }
//   );
// };

// let initialized = false;

// let sdkReady = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   const interval = setInterval(() => {

//     if (
//       window.BlazeSDK &&
//       typeof window.BlazeSDK.initiate ===
//         "function"
//     ) {

//       clearInterval(interval);

//       window.BlazeSDK.initiate(
//         {
//           requestId:
//             "init_" + Date.now(),

//           service:
//             "in.breeze.onecco",

//           payload: {
//             merchantId:
//               "gemrishi",

//             env: "release",

//             shopUrl:
//               "https://gemrishi.com",
//           },
//         },

//         (response) => {

//           console.log(
//             "BLAZE INIT:",
//             response
//           );

//           // IMPORTANT

//           sdkReady = true;
//         }
//       );

//       initialized = true;
//     }

//   }, 500);
// };

// export const openBlazeCheckout =
//   async ({
//     cart,
//     signature,
//   }) => {

//     // WAIT FOR SDK READY

//     let retries = 0;

//     while (
//       !sdkReady &&
//       retries < 20
//     ) {

//       console.log(
//         "Waiting for SDK init..."
//       );

//       await new Promise((r) =>
//         setTimeout(r, 500)
//       );

//       retries++;
//     }

//     // FINAL CHECK

//     if (
//       !window.BlazeSDK ||
//       typeof window.BlazeSDK.process !==
//         "function"
//     ) {

//       console.error(
//         "BlazeSDK process missing"
//       );

//       console.log(
//         "SDK:",
//         window.BlazeSDK
//       );

//       return;
//     }

//     // PROCESS

//     window.BlazeSDK.process(
//       {
//         requestId:
//           "process_" + Date.now(),

//         service:
//           "in.breeze.onecco",

//         payload: {
//           action:
//             "startPayment",

//           merchantId:
//             "gemrishi",

//           env: "release",

//           shopUrl:
//             "https://gemrishi.com",

//           cart,

//           signature,
//         },
//       },

//       (response) => {

//         console.log(
//           "PROCESS RESPONSE:",
//           response
//         );
//       }
//     );
//   };


// import BlazeSDK from "@juspay/blaze-sdk-web";

// let initialized = false;

// let sdkReady = false;

// export const initBlaze = () => {

//   if (initialized) return;

//   console.log(
//     "SDK OBJECT:",
//     BlazeSDK
//   );

//   BlazeSDK.initiate(
//     {
//       requestId: "init_" + Date.now(),

//       service: "in.breeze.onecco",

//       payload: {
//         action: "initiate",

//         merchantId: "gemrishi",

//         environment: "production",
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

// export const openBlazeCheckout =
//   async ({
//     cart,
//     signature,
//   }) => {

//     let retries = 0;

//     while (
//       !sdkReady &&
//       retries < 20
//     ) {

//       console.log(
//         "Waiting for SDK init..."
//       );

//       await new Promise((r) =>
//         setTimeout(r, 500)
//       );

//       retries++;
//     }

//     if (
//       typeof BlazeSDK.process !==
//       "function"
//     ) {

//       console.error(
//         "BlazeSDK process missing"
//       );

//       console.log(
//         BlazeSDK
//       );

//       return;
//     }

//     BlazeSDK.process(
//       {
//         requestId: "process_" + Date.now(),

//         service: "in.breeze.onecco",

//         payload: {
//           action: "startCheckout",

//           cart: response.data.cart,

//           signature:
//             response.data.signature,

//           keyId: "YOUR_KEY_ID",
//         },
//       },

//       (res) => {
//         console.log(
//           "PROCESS RESPONSE:",
//           res
//         );
//       }
//     );

//   };



import BlazeSDK from "@juspay/blaze-sdk-web";

let initialized = false;

export const initBlaze = () => {

window.BlazeSDK.initiate(
  {
    requestId:
      crypto.randomUUID(),

    service:
      "in.breeze.onecco",

    payload: {
      action:
        "initiate",

      merchantId:
        "gemrishi",

      environment:
        "production",

      integrationType:
        "redirection",
    },
  },

  (response) => {

    console.log(
      "BLAZE INIT:",
      response
    );
  }
);
  
};
