const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const BoardSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

BoardSchema.plugin(AutoIncrement, {
  id: "board_sequence",
  reference_fields: "nickname",
  inc_field: "boardId"
});
module.exports = BoardSchema;
