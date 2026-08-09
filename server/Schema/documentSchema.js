import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Document",
    },
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const document = mongoose.model("document", documentSchema);

export default document;

