import express from "express";
import {
  getAllcontacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();
router.use(arcjetProtection,protectRoute);

router.get("/contacts",getAllcontacts);
router.get("/chats",getChatPartners);
router.get("/:id",getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;