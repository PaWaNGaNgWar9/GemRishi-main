import express from "express";
import { breezeWebhook } from "../controllers/breezeWebhook.controller.js";

const router = express.Router();

router.post("/platform", breezeWebhook);

export default router;