const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
  email: { type: String },
  subject: { type: String },
  allque: [
    {
      subject: { type: String },
      qtype: {
        type: String,
      },
      que: {
        type: String,
      },
      ansA: { type: String },
      ansB: { type: String },
      ansC: { type: String },
      ansD: { type: String },
      ansBrief: { type: String },
      ansBool: { type: String },
      mcqans: { type: String },
      marks: { type: Number },
      date: { type: Date },
      deleted: { type: Boolean, default: false },
    },
  ],
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("question", QuestionSchema);
