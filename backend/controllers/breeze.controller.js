import crypto from "crypto";
import fs from "fs";
import path from "path";

export const signCart = (req, res) => {
  try {
    console.log("🔥 Incoming body:", req.body);

    if (!req.body || !req.body.cart) {
      return res.status(400).json({
        success: false,
        message: "Cart missing",
      });
    }

    const cart = req.body.cart;

    const privateKeyPath = path.resolve("private-key.pem");

    if (!fs.existsSync(privateKeyPath)) {
      console.error("❌ Private key not found at:", privateKeyPath);
      return res.status(500).json({
        success: false,
        message: "Private key missing",
      });
    }

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const cartString = JSON.stringify(cart);

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(cartString);
    signer.end();

    const signature = signer.sign(privateKey, "base64");

    return res.json({
      cart: cartString,
      signature,
    });

  } catch (err) {
    console.error("❌ SIGN CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Signing failed",
      error: err.message,
    });
  }
};