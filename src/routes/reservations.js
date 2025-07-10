const express = require("express");
const Reservation = require("../models/Reservation");
const router = express.Router();

/**
 * POST /api/reservations
 * Create a new reservation
 */
router.post("/", async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      email,
      dateTime,
      partySize,
      specialRequests = "",
    } = req.body;

    if (!restaurantId || !name || !email || !dateTime || !partySize) {
      return res.status(400).json({
        error: "restaurantId, name, email, dateTime & partySize are required",
      });
    }

    const reservation = await Reservation.create({
      restaurantId,
      name,
      email,
      dateTime: new Date(dateTime),
      partySize,
      specialRequests,
    });

    return res.status(201).json({
      reservationId: reservation._id,
      status: reservation.status,
    });
  } catch (err) {
    console.error("❌ POST /api/reservations error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /api/reservations/:id
 * Modify dateTime, partySize, specialRequests or status (for tracking purpose)
 */
router.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    ["dateTime", "partySize", "specialRequests", "status"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ensure valid future date if dateTime changed
    if (updates.dateTime && new Date(updates.dateTime) < new Date()) {
      return res.status(400).json({ error: "dateTime must be in the future" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    return res.json(updated);
  } catch (err) {
    console.error("❌ PATCH /api/reservations/:id error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/reservations/:id
 * Cancel a reservation
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE /api/reservations/:id error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * Helper for chat listing:
 *   - If no email in req.body, ask the frontend to prompt the user.
 *   - Otherwise return up to 10 most‑recent reservations.
 */
async function handleListForChat(req, res) {
  const email = req.body.email;
  if (!email) {
    // prompt user for their email
    return res.json({ type: "AskEmail", object: "reservations" });
  }

  const list = await Reservation.find({ email })
    .sort("-dateTime")
    .limit(10)
    .lean();

  // map to minimal payload
  const reservations = list.map((r) => ({
    id: r._id,
    dateTime: r.dateTime.toISOString(),
    partySize: r.partySize,
    specialRequests: r.specialRequests,
    status: r.status,
  }));

  return res.json({
    type: "ManageReservations",
    reservations,
  });
}

module.exports = {
  router,
  handleListForChat,
};
