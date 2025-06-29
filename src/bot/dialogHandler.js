const { analyzeMessage } = require("./azureCLU");
const Restaurant = require("../models/Restaurant");

async function handleMessage(userMessage) {
    const cluResponse = await analyzeMessage(userMessage);
    const intent = cluResponse.result.prediction.topIntent;
    const entities = cluResponse.result.prediction.entities || [];

    const entityMap = {};
    for (const ent of entities) {
        const key = ent.category.toLowerCase();
        entityMap[key] = ent.text;
    }

    if (intent === "SearchRestaurant") {
        const query = {};
        if (entityMap.location) {
            query.location = { $regex: new RegExp(entityMap.location, "i") };
        }
        if (entityMap.cuisine) {
            query.cuisines = { $regex: new RegExp(entityMap.cuisine, "i") };
        }

        const results = await Restaurant.find(query).limit(5);
        if (results.length === 0) return `Sorry, I couldn't find any restaurants matching your request.`;

        return results.map(r => `🍽️ *${r.name}* - ${r.cuisines.join(", ")} - ⭐ ${r.rate}/5`).join("\n\n");
    }

    return "Sorry, I didn’t understand that. Try asking for a restaurant by location or cuisine.";
}

module.exports = { handleMessage };
