// import axios from "axios";

// export const signCart = async (req, res) => {

//   try {

//     console.log("REQ BODY:", req.body);

//     const response = await axios.post(
//       "https://apothiki.vercel.app/cart-sign-api",
//       req.body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("SIGN RESPONSE:", response.data);

//     return res.json(response.data);

//   } catch (err) {

//     console.error(
//       "SIGN ERROR:",
//       err.response?.data || err.message
//     );

//     return res.status(500).json({
//       success: false,
//       error:
//         err.response?.data ||
//         err.message,
//     });
//   }
// };



// import crypto from "crypto";
// import fs from "fs";
// import path from "path";

// export const signCart = async (req, res) => {
//   try {
//     const breezeCart = req.body.cart;

//     console.log("CART:", breezeCart);

//     // STRINGIFY CART

//     const cartString =
//       JSON.stringify(breezeCart);

//     // PRIVATE KEY

//     const privateKey =
//       fs.readFileSync(
//         path.join(
//           process.cwd(),
//           "private-key.pem"
//         ),
//         "utf8"
//       );

//     // SIGN

//     const signer =
//       crypto.createSign(
//         "RSA-SHA256"
//       );

//     signer.update(cartString);

//     signer.end();

//     const signature =
//       signer.sign(
//         privateKey,
//         "base64"
//       );

//     return res.json({
//       success: true,

//       cart: cartString,

//       signature,
//     });

//   } catch (err) {

//     console.error(
//       "SIGN ERROR:",
//       err
//     );

//     return res.status(500).json({
//       success: false,

//       error: err.message,
//     });
//   }
// };



// import axios from "axios";

// export const signCart =
//   async (req, res) => {

//     try {

//       console.log(
//         "BODY:",
//         req.body
//       );

//       const response =
//         await axios.post(
//           "https://apothiki.vercel.app/cart-sign-api",
//           req.body,
//           {
//             headers: {
//               "Content-Type":
//                 "application/json",
//             },
//           }
//         );

//       console.log(
//         "APOTHIKI:",
//         response.data
//       );

//       return res.json(
//         response.data
//       );

//     } catch (err) {

//       console.error(
//         "SIGN ERROR:"
//       );

//       console.error(
//         err.response?.data
//       );

//       console.error(
//         err.message
//       );

//       return res.status(500).json({
//         success: false,

//         error:
//           err.response?.data ||
//           err.message,
//       });
//     }
//   };


import crypto from "crypto";
import fs from "fs";
import path from "path";

export const signCart =
  async (req, res) => {

    try {

      const breezeCart =
        req.body.cart;

      const cartString =
        JSON.stringify(
          breezeCart
        );

      const privateKey =
        fs.readFileSync(
          path.join(
            process.cwd(),
            "private-key.pem"
          ),
          "utf8"
        );

      const signer =
        crypto.createSign(
          "RSA-SHA256"
        );

      signer.update(
        cartString
      );

      signer.end();

      const signature =
        signer.sign(
          privateKey,
          "base64"
        );

      return res.json({
        success: true,

        cart:
          breezeCart,

        signature,
      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };
