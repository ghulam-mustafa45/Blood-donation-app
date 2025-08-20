import express from "express";
import { getUsers,addPatient,getPatients } from "../controllers/donor.js";




const router = express.Router();

router.get("/users", getUsers);
router.post("/registerPatient", addPatient);
router.get("/allPatients", getPatients);

export default router;