import { Router } from "express";
import { httpStatusCodes } from "../constants/statusCode.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(httpStatusCodes.OK).json({
    status: "ok",
    message: "server is healthy"
  });
});

export default router;