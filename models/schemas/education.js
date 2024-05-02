const { Schema } = require("mongoose");

const EducationSchema = new Schema({
  // id: {
  //   // 누구의 학력인지 알기 위해 id 넣음
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
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
    required: true,
  },
});

module.exports = EducationSchema;
