import express from "express";
import { home, register, login } from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import { getDonors } from "../controllers/donor.js";
import { validateRegister, validateLogin } from "../middleware/validate-middleware.js";
import { registerSchema, loginSchema } from "../validators/auth-validators.js";



const router = express.Router();

router.get("/", home);
router.post("/register", validateRegister(registerSchema), register);
router.post("/login", validateLogin(loginSchema), login);
router.get("/users", getDonors);

// lightweight /auth/me for Redux hydration
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({});
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (await import("../models/User.js")).default.findById(decoded.userId);
    if (!user) return res.status(401).json({});
    res.json({ user });
  } catch (e) {
    res.status(401).json({});
  }
});

export default router;