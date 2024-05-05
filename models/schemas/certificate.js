const { Schema } = require("mongoose");

const CertificateSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  certificateId: {
    type: Number,
    required: true,
    default: 1,
  },
  title: {
    type: String,
    required: true,
  },
  acqDate: {
    type: String,
    required: true,
  },
});

module.exports = CertificateSchema;
