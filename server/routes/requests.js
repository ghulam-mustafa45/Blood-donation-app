import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import { createRequestSchema, updateRequestSchema, statusSchema, assignSchema, etaSchema, noteSchema } from "../validators/request-validators.js";
import * as ctrl from "../controllers/requestsController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/mine", ctrl.listMine);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", validate(createRequestSchema), ctrl.create);
router.put("/:id", validate(updateRequestSchema), ctrl.update);
router.delete("/:id", ctrl.remove);

router.patch("/:id/status", validate(statusSchema), ctrl.setStatus);
router.patch("/:id/assign", validate(assignSchema), ctrl.assignDonor);
router.patch("/:id/eta", validate(etaSchema), ctrl.setEta);
router.post("/:id/notes", validate(noteSchema), ctrl.addNote);
router.post("/:id/close", ctrl.closeRequest);

export default router;


