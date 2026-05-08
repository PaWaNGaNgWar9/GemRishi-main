import axios from "axios";

export const signCart = async (req, res) => {

  try {

    const response = await axios.post(
      "https://apothiki.vercel.app/cart-sign-api",
      {
        merchantId: "gemrishi",

        env: "release",

        shopUrl: "https://gemrishi.com",

        cart: req.body.cart,
      }
    );

    return res.json(response.data);

  } catch (err) {

    console.error(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};