// src/routes/reservation
const express     = require('express');
const Reservation = require('../models/Reservation');
const router      = express.Router();

// 1) Create a reservation
router.post('/', async (req, res) => {
  const { restaurantId, name, email, dateTime, partySize, specialRequests } = req.body;
  if (!restaurantId || !name || !email || !dateTime || !partySize) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const reservation = await Reservation.create({ restaurantId, name, email, dateTime, partySize, specialRequests });
  res.status(201).json({ reservationId: reservation._id, status: reservation.status });
});

// 2) List reservations for a user
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email query required' });
  const list = await Reservation.find({ email }).sort('-dateTime');
  res.json(list);
});

// 3) Modify or cancel (PATCH)
router.patch('/:id', async (req, res) => {
  const updates = {};
  ['dateTime','partySize','specialRequests','status'].forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  const updated = await Reservation.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

module.exports = router;
