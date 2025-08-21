import Request from "../models/Request.js";
import User from "../models/User.js";

function addActivity(doc, type, by, from, to) {
  doc.activity.push({ type, byUserId: by?.userId, byName: by?.name, from, to, createdAt: new Date() });
}

export async function list(req, res) {
  const { status, city, bloodType } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (city) filter.city = new RegExp(String(city), "i");
  if (bloodType) filter.bloodType = String(bloodType);
  const items = await Request.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

export async function listMine(req, res) {
  const items = await Request.find({ requestedBy: req.user.userId }).sort({ createdAt: -1 });
  res.json(items);
}

export async function getOne(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
}

export async function create(req, res) {
  const data = req.body;
  const doc = new Request({ ...data, requestedBy: req.user.userId, status: "Open" });
  addActivity(doc, "created", req.user);
  await doc.save();
  res.status(201).json(doc);
}

export async function update(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  if (String(doc.requestedBy) !== String(req.user.userId)) return res.status(403).json({ message: "Forbidden" });
  const before = doc.toObject();
  Object.assign(doc, req.body);
  await doc.save();
  addActivity(doc, "updated", req.user, before, doc.toObject());
  res.json(doc);
}

export async function remove(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  if (String(doc.requestedBy) !== String(req.user.userId)) return res.status(403).json({ message: "Forbidden" });
  await doc.deleteOne();
  res.json({ success: true });
}

export async function setStatus(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  const from = doc.status;
  doc.status = req.body.status;
  addActivity(doc, "status_changed", req.user, { status: from }, { status: doc.status });
  await doc.save();
  res.json(doc);
}

export async function assignDonor(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  const donor = await User.findById(req.body.donorId);
  doc.assignment = donor ? { donorId: donor._id.toString(), donorName: donor.name, assignedAt: new Date() } : { donorId: req.body.donorId, donorName: "Unknown", assignedAt: new Date() };
  addActivity(doc, "assigned", req.user, undefined, doc.assignment);
  await doc.save();
  res.json(doc);
}

export async function setEta(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  const from = doc.etaAt;
  doc.etaAt = new Date(req.body.etaAt);
  addActivity(doc, "eta_updated", req.user, { etaAt: from }, { etaAt: doc.etaAt });
  await doc.save();
  res.json(doc);
}

export async function addNote(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  const note = { authorId: req.user.userId, authorName: req.user.name, message: req.body.message, createdAt: new Date() };
  doc.notes.push(note);
  addActivity(doc, "note_added", req.user, undefined, note);
  await doc.save();
  res.json(doc);
}

export async function closeRequest(req, res) {
  const doc = await Request.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  const from = doc.status;
  doc.status = "Cancelled";
  addActivity(doc, "closed", req.user, { status: from }, { status: doc.status });
  await doc.save();
  res.json(doc);
}


