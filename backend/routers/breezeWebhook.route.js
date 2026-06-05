import express from "express";
import { platformWebhook } from "../controllers/breezeWebhook.controller.js";

const router = express.Router();

router.post("/platform", platformWebhook);

export default router;