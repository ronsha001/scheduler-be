import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
    },
    categories: {
      type: [
        {
          name: String, 
          time: Number,
          scheduled: Number
        }
      ]
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Store", StoreSchema);