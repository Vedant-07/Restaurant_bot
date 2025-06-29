// src/bot/azureCLU.js
const axios = require('axios');
require("dotenv").config();

const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const AZURE_KEY = process.env.AZURE_KEY;
const PROJECT_NAME = process.env.PROJECT_NAME;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;


async function analyzeMessage(text) {
    try {
        const url = `${AZURE_ENDPOINT}/language/:analyze-conversations?api-version=2022-10-01-preview`;
        const headers = {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Content-Type': 'application/json'
        };

        const body = {
            kind: "Conversation",
            analysisInput: {
                conversationItem: {
                    id: "1",
                    participantId: "user",
                    text: text
                }
            },
            parameters: {
                projectName: PROJECT_NAME,
                deploymentName: DEPLOYMENT_NAME,
                verbose: true
            }
        };

        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (err) {
        console.error("CLU error:", err.response?.data || err.message);
        return null;
    }
}

module.exports = { analyzeMessage };