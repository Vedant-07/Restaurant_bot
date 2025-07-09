const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    dateTime: { type: Date, required: true },
    partySize: { type: Number, required: true, min: 1 },
    specialRequests: { type: String, default: "" },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
