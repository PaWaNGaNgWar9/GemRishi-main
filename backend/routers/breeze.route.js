import express from "express";
import { signCart } from "../controllers/breeze.controller.js";

const router = express.Router();

router.post("/sign-cart", signCart);

export default router;