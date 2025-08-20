import express from "express";
import { home, register, login } from "../controllers/authController.js";
import { getUsers } from "../controllers/donor.js";
import { validateRegister, validateLogin } from "../middleware/validate-middleware.js";
import { registerSchema, loginSchema } from "../validators/auth-validators.js";



const router = express.Router();

router.get("/", home);
router.post("/register", validateRegister(registerSchema), register);
router.post("/login", validateLogin(loginSchema), login);
router.get("/users", getUsers);

export default router;