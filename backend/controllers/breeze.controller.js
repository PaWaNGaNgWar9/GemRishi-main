import axios from "axios";

export const signCart = async (req, res) => {

  try {

    console.log("REQ BODY:", req.body);

    const response = await axios.post(
      "https://apothiki.vercel.app/cart-sign-api",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SIGN RESPONSE:", response.data);

    return res.json(response.data);

  } catch (err) {

    console.error(
      "SIGN ERROR:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      error:
        err.response?.data ||
        err.message,
    });
  }
};