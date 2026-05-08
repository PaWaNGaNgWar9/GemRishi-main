import crypto from "crypto";
import fs from "fs";
import path from "path";

export const signCart = async (req, res) => {
  try {

    if (!req.body?.cart) {
      return res.status(400).json({
        success: false,
        message: "Cart missing",
      });
    }

    const cart = req.body.cart;

    const privateKeyPath = path.resolve("private-key.pem");

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    // IMPORTANT
    const payload = JSON.stringify(cart);

    const signer = crypto.createSign("RSA-SHA256");

    signer.update(payload);

    signer.end();

    const signature = signer.sign(privateKey, "base64");

    return res.json({
      success: true,
      cart,
      signature,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};