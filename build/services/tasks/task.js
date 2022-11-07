import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: false
    },
    due: {
        type: String,
        required: false
    },
    checked: {
        type: Boolean,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    isExpired: {
        type: Boolean,
        required: false,
        default: false
    }
}, { versionKey: false, timestamps: true });
export default mongoose.model("Task", taskSchema);
