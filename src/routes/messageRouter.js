const express = require("express");
const { analyzeMessage } = require("../bot/azureCLU");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

function extractEntities(entityArray) {
    const result = {};
    entityArray.forEach(entity => {
        const key = entity.category.toLowerCase();

        if (result[key]) {
            if (Array.isArray(result[key])) {
                result[key].push(entity.text);
            } else {
                result[key] = [result[key], entity.text];
            }
        } else {
            result[key] = entity.text;
        }
    });
    return result;
}

router.post("/", async (req, res) => {
    const userMessage = req.body.text;

    if (!userMessage) {
        return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    try {
        const cluResponse = await analyzeMessage(userMessage);
        const prediction = cluResponse?.result?.prediction;

        if (!prediction) {
            return res.status(500).json({ error: "CLU response malformed" });
        }

        const intent = prediction.topIntent;
        const entityArray = prediction.entities || [];
        const entities = extractEntities(entityArray);

        const cuisine = entities.cuisine;
        const location = entities.location;

        // let query = {};
        // if (cuisine) query.cuisines = { $in: [cuisine] };
        // if (location) query.location = location;
        let query = {};
if (cuisine) {
    query.cuisines = { $regex: new RegExp(cuisine, 'i') };
}
if (location) {
    query.location = { $regex: new RegExp(location, 'i') };
}


        
        const results = Object.keys(query).length > 0
    ? await Restaurant.find(query).limit(7)
    : await Restaurant.find().sort({ rate: -1 }).limit(7);

    console.log("Final Query:", query);
console.log("Results found:", results.length);


        return res.json({
            intent,
            entities,
            results
        });

    } catch (err) {
        console.error("CLU error:", err.message);
        return res.status(500).json({ error: "Something went wrong with CLU or DB" });
    }
});


module.exports = router;
