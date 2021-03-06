const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    materials: [
      {
        fileName: {
          type: String,
        },
        fileKey: {
          type: String,
        },
      },
    ],
    posted: {
      type: Boolean,
      default: false,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shift', ShiftSchema);
