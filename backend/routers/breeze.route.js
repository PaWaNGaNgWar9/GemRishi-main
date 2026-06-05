import express from "express";
import { signCart } from "../controllers/breeze.controller.js";
import { platformWebhook } from "../controllers/breezeWebhook.controller.js";

const router = express.Router();

router.post("/sign-cart", signCart);

router.post("/platform", platformWebhook);

export default router;