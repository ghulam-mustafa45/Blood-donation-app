import mongoose from "mongoose";

const requestNoteSchema = new mongoose.Schema({
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
}, { _id: false });

const activitySchema = new mongoose.Schema({
    type: { type: String, enum: ["status_changed", "assigned", "eta_updated", "note_added", "closed", "auto_expired", "created", "updated"], required: true },
    byUserId: String,
    byName: String,
    from: mongoose.Schema.Types.Mixed,
    to: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: () => new Date() },
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    donorId: String,
    donorName: String,
    assignedAt: { type: Date, default: () => new Date() },
}, { _id: false });

const requestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    bloodType: { type: String, required: true },
    city: { type: String, required: true },
    hospital: String,
    details: String,
    phone: String,
    gender: String,

    requestedBy: { type: String, required: true },

    status: { type: String, enum: ["Open", "In Progress", "Fulfilled", "Cancelled", "Expired"], default: "Open", index: true },
    assignment: assignmentSchema,
    etaAt: Date,
    notes: [requestNoteSchema],
    expiresAt: Date,
    activity: [activitySchema],
}, { timestamps: true });

requestSchema.index({ city: 1, bloodType: 1, status: 1, createdAt: -1 });

const Request = mongoose.model("Request", requestSchema);
export default Request;


