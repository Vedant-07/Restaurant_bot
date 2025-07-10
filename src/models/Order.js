const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    email: { type: String, required: true },
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },
    address: { type: String },
    status: {
      type: String,
      default: "Received",
      enum: ["Received", "Preparing", "On the way", "Delivered", "Cancelled"], // TODO: added for status tracking func.
    },
    history: [
      {
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
