import { Schema, model, models } from "mongoose";

const produceSchema = new Schema(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "Vegetables",
        "Fruits",
        "Herbs",
        "Root Veg",
        "Natural",
        "Dairy",
        "Grains",
      ],
    },

    img: {
      type: String,
      default: "",
    },

    cloudinaryId: {
      type: String,
      default: "",
    },

    isOrganic: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Produce ?? model("Produce", produceSchema, "produce");
