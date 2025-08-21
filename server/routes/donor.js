import express from "express";
import { getDonors,addPatient,getPatients } from "../controllers/donor.js";




const router = express.Router();

router.get("/donors", getDonors);
router.post("/registerPatient", addPatient);
router.get("/allPatients", getPatients);

export default router;