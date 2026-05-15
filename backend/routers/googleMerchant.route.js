import { Router } from "express";
import { getExcelData } from "../controllers/googleMerchant.controller.js";

const router = Router();

router.get("/excel-data", getExcelData);

export default router;