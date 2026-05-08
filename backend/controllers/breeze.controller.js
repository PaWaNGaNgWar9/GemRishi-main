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



import crypto from "crypto";
import fs from "fs";
import path from "path";

export const signCart = async (req, res) => {

  try {

    const breezeCart = req.body.cart;

    console.log("CART:", breezeCart);

    // STRINGIFY CART

    const cartString =
      JSON.stringify(breezeCart);

    // READ PRIVATE KEY

    const privateKey =
      fs.readFileSync(
        path.resolve("private-key.pem"),
        "utf8"
      );

    // CREATE SIGNATURE

    const signer =
      crypto.createSign("RSA-SHA256");

    signer.update(cartString);

    signer.end();

    const signature =
      signer.sign(
        privateKey,
        "base64"
      );

    // RETURN

    return res.json({
      success: true,

      cart: cartString,

      signature,
    });

  } catch (err) {

    console.error(
      "SIGN ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      error: err.message,
    });
  }
};
