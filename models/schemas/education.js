const { Schema } = require("mongoose");

const EducationSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  schoolState: {
    type: String,
    required: true,
  },
});

module.exports = EducationSchema;
