const { Schema } = require("mongoose");

const CertificateSchema = new Schema({
  id: {
    type: String,
    required: true,
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
