// src/routes/viewMenu.js
const Restaurant = require("../models/Restaurant");

async function handle(req, res, entities) {
  // We’ll accept either a restaurantName entity or an explicit ID in the request body
  const idFromBody = req.body.restaurantId;
  const nameEntity = entities.find(e => e.category === "restaurantName")?.text;

  let rest;
  if (idFromBody) {
    rest = await Restaurant.findById(idFromBody, "name menu_item reviews_list");
  } else if (nameEntity) {
    rest = await Restaurant.findOne(
      { name: new RegExp(nameEntity, "i") },
      "name menu_item reviews_list"
    );
  }

  if (!rest) {
    return res.json({ type: "ViewMenu", error: "Restaurant not found." });
  }

  return res.json({
    type: "ViewMenu",
    restaurant: {
      id:    rest._id,
      name:  rest.name,
      menu:  rest.menu_item,
      reviews: rest.reviews_list.map(r => ({
        rating: r.rating,
        text:   r.review
      }))
    }
  });
}

module.exports = { handle };
