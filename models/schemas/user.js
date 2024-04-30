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
    default: "설명이 아직 없습니다. 설명을 추가해주세요.",
  },
});

module.exports = UserSchema;
