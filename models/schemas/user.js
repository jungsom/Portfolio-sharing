const { Schema } = require("mongoose");

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  education: [
    {
      type: Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
});

module.exports = UserSchema;
