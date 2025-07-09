const express = require('express');
const Order   = require('../models/Order');
const router  = express.Router();

// POST /api/orders  — place a new order
router.post('/', async (req, res) => {
  try {
    const { restaurantId, items, email, orderType } = req.body;
  if (!restaurantId || !items?.length || !email || !orderType) {
    return res.status(400).json({ error: 'restaurantId, items[], email & orderType required' });
  }

  if (orderType === 'delivery' && !address) {
    return res.status(400).json({ error: 'Address is required for delivery' });
  }

  const total   = items.reduce((sum,i) => sum + i.price * i.quantity, 0);
  const history = [{ status: 'Received' }];

  const order = await Order.create({
    restaurantId,
    items,
    total,
    email,
    orderType,
    ...(orderType === 'delivery' ? { address } : {}),
    history
  });

  res.status(201).json({
    orderId: order._id,
    status:  order.status,
    orderType: order.orderType,
    total:   order.total
  });
  } catch (err) {
    console.error('❌ POST /api/orders error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id  — fetch order status & history ,TODO:improve the history feature
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id, 'restaurantId items total email status history createdAt');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('❌ GET /api/orders/:id error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// src/routes/orders.js (add this below your POST & GET)
router.patch('/:id', async (req, res) => {
  const { items, status } = req.body;
  const updates = {};
  if (Array.isArray(items)) {
    updates.items = items;
    updates.total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  if (status) {
    updates.status = status;
    updates.$push = { history: { status, at: new Date() } };
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }  // return the updated document
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('❌ PATCH /api/orders/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE /api/orders/:id", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// helper for chat listing
async function handleListForChat(req, res) {
  const email = req.body.email;
  if (!email) {
    //  return a special JSON
    return res.json({ type: 'AskEmail', object: 'orders' });
  }

  const orders = await Order.find({ email }).sort('-createdAt').limit(10);
  if (!orders.length) {
    return res.json({ type: 'ManageOrders', orders: [] });
  }

  return res.json({
    type: 'ManageOrders',
    orders: orders.map(o => ({
      id:        o._id,
      placedAt:  o.createdAt.toISOString(),
      total:     o.total,
      status:    o.status,
      orderType: o.orderType,
      items:     o.items.map(i => ({
        menuItemId: i.menuItemId.toString(),
        name:       i.name,
        price:      i.price,
        quantity:   i.quantity
      }))
    }))
  });
  
}

module.exports = {
  router,
  handleListForChat
};

