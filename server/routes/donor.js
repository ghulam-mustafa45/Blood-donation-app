import express from "express";
import { getDonors,addPatient,getPatients } from "../controllers/donor.js";
import requireAuth from "../middleware/requireAuth.js";




const router = express.Router();

router.get("/donors", getDonors);
router.post("/registerPatient", addPatient);
router.get("/allPatients", getPatients);

// Self donor profile endpoints for dashboard
router.get("/donors/me", requireAuth, async (req, res) => {
  const User = (await import("../models/User.js")).default;
  const me = await User.findById(req.user.userId);
  if (!me) return res.status(404).json({});
  res.json({ name: me.name, city: me.city, bloodType: me.bloodType, contactInfo: me.contactInfo });
});

router.put("/donors/me", requireAuth, async (req, res) => {
  const User = (await import("../models/User.js")).default;
  const me = await User.findById(req.user.userId);
  if (!me) return res.status(404).json({});
  const { name, city, bloodType, contactInfo } = req.body || {};
  if (name !== undefined) me.name = name;
  if (city !== undefined) me.city = city;
  if (bloodType !== undefined) me.bloodType = bloodType;
  if (contactInfo !== undefined) me.contactInfo = contactInfo;
  // Preserve existing role; if missing, default to 'Donor' for donor profile use-case
  if (!me.role) me.role = 'Donor';
  await me.save();
  res.json({ name: me.name, city: me.city, bloodType: me.bloodType, contactInfo: me.contactInfo });
});

export default router;