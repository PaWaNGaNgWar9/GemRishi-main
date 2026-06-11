import express from "express";
import { signCart, platformWebhook } from "../controllers/breeze.controller.js";

const router = express.Router();

router.post("/sign-cart", signCart);

router.post("/platform", platformWebhook);

export default router;

