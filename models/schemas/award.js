const { Schema } = require("mongoose");

const AwardSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  awards: {
    // 수상내역
    type: String,
    required: true,
  },
  details: {
    // 상세내역
    type: String,
    required: true,
  },
});

module.exports = AwardSchema;
