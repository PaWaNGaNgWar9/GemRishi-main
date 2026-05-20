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

let initialized = false;

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
      }
    );
  } catch (err) {
    console.error("Blaze Init Error:", err);
  }
};

export default BlazeSDK;

