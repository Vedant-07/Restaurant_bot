const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: Number,
  review: String
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: Number,
  location: String,
  rest_type: String,
  online_order: Boolean,
  book_table: Boolean,
  rate: Number,
  votes: Number,
  approx_cost_for_two_people: Number,
  cuisines: [String],
  dish_liked: [String],
  menu_item: [String],
  listed_in_city: String,
  listed_in_type: String,
  reviews_list: [ReviewSchema]
}, { collection: "restaurants" });

module.exports = mongoose.model('Restaurant', RestaurantSchema);