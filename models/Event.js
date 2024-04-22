import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    time: {
      type: {
        start: Date,
        end: Date
      },
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);