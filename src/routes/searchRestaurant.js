const Restaurant = require("../models/Restaurant");

async function handle(req, res, entities) {
  // 1) Extract all cuisine and location entities
  const cuisines = entities
    .filter((e) => e.category.toLowerCase() === "cuisine")
    .map((e) => e.text);

  const locations = entities
    .filter((e) => e.category.toLowerCase() === "location")
    .map((e) => e.text);

  // 2) Build Mongo filter
  const filter = {};

  if (cuisines.length) {
    // require all requested cuisines (case-insensitive)
    filter.cuisines = {
      $all: cuisines.map((c) => new RegExp(c, "i")),
    };
  }
  if (locations.length) {
    // require any of the requested locations
    filter.location = {
      $all: locations.map((l) => new RegExp(l, "i")),
    };
  }

  // 3) Query, sort, and limit
  const results = await Restaurant.find(filter)
    .sort({ votes: -1, rate: -1 })
    .limit(10);

  // 4) Respond with extended fields
  return res.json({
    type: "SearchRestaurant",
    restaurants: results.map((r) => ({
      id: r._id,
      name: r.name,
      location: r.location,
      address: r.address,
      votes: r.votes,
      rate: r.rate,
      phone: r.phone,
      cost: r.approx_cost_for_two_people,
      online_order: r.online_order,
      cuisines: r.cuisines,
      book_table: r.book_table,
    })),
  });
}

module.exports = { handle };
