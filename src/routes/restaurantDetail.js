// src/routes/restaurantDetail.js
const express    = require("express");
const Restaurant = require("../models/Restaurant");
const router     = express.Router();

// GET /api/restaurant/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rest = await Restaurant.findById(id, 
      "name menu_item reviews_list"); // only pull what we need

    if (!rest) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Shape the response:
    return res.json({
      id: rest._id,
      name: rest.name,
      menu: rest.menu_item.map(mi => ({
        id: mi._id,
        name: mi.name,
        price: mi.price
      })),
      reviews: rest.reviews_list.map(r => ({
        rating: r.rating,
        text:   r.review
      }))
    });
  } catch (err) {
    console.error("❌ /api/restaurant/:id error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
