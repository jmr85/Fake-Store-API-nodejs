const mongoose = require("mongoose");
require("dotenv").config();

// Create Schema
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    coupon: {
      type: mongoose.Schema.ObjectId,
      ref: "Coupon",
    },
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

cartSchema.set('toJSON', {
  transform: function(doc, returnedObject) {
    delete returnedObject.__v;
    return returnedObject;
  }
});

// Create model
const BrandModel = mongoose.model("Cart", cartSchema);
module.exports = BrandModel;
