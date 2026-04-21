import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests - please try again later." });
      } else if (decision.reason.isBot()) {
        return res
          .status(403)
          .json({ message: "Access denied - bots are not allowed." });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by Security Policy." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Access denied - suspected spoofed bot.",
        message: "Access denied - suspected spoofed bot.",
      });
    }
    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    next();
  }
};
