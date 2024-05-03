const { Schema } = require("mongoose");

const EducationSchema = new Schema({
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  // id: {
  //   type: String,
  //   required: true,
  // },
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
    // enum: ["재학중", "학사졸업", "석사졸업", "박사졸업"],
    required: true,
  },
});

module.exports = EducationSchema;
