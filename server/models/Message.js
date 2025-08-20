import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  room: { type: String, index: true },
  userName: String,
  text: String,
  createdAt: { type: Date, default: Date.now, index: true },
});
export default mongoose.model("Message", messageSchema);