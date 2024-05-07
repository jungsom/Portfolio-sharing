const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const EducationSchema = new Schema({
  userId: {
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
  schoolStatus: {
    type: String,
    // enum: ["재학중", "학사졸업", "석사졸업", "박사졸업"],
    required: true,
  },
});

EducationSchema.plugin(AutoIncrement, {
  id: "education_sequence",
  reference_fields: "userId",
  inc_field: "educationId",
});

module.exports = EducationSchema;
