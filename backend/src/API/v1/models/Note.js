// // src/models/Note.model.js
// import mongoose from "mongoose";

// const NoteSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: { type: String, trim: true, maxlength: 200 },
//     content: { type: String, required: true },
//     tags: [{ type: String, trim: true, lowercase: true }],
//     isPinned: { type: Boolean, default: false },
//     applicationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Application",
//       default: null,
//     },
//     isDeleted: { type: Boolean, default: false }, // Soft delete sau này
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes
// NoteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });
// NoteSchema.index({ userId: 1, applicationId: 1 });
// NoteSchema.index({ tags: 1 });

// const Note = mongoose.model("Note", NoteSchema);

// export default Note;


// ====================================
// src/models/Note.model.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    isPinned: { type: Boolean, default: false },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    isDeleted: { type: Boolean, default: false },

    // ==================== THÊM MỚI ====================
    reminderDate: {
      type: Date,
      default: null,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },

    reminderStatus: {
      type: String,
      enum: ["pending", "done", "missed"],
      default: "pending",
    },
    
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
NoteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });
NoteSchema.index({ userId: 1, applicationId: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ reminderDate: 1 }); // Hỗ trợ query nhắc nhở

const Note = mongoose.model("Note", NoteSchema);

export default Note;