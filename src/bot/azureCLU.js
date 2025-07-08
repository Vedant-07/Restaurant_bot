const axios = require("axios");

const endpoint = process.env.AZURE_ENDPOINT;
const key      = process.env.AZURE_KEY;
const project  = process.env.PROJECT_NAME;
const deployment = process.env.DEPLOYMENT_NAME;

async function analyzeMessage(text) {
  const url = `${endpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`;
  const body = {
    kind: "Conversation",
    analysisInput: {
      conversationItem: {
        id: "1",
        participantId: "user",
        text
      }
    },
    parameters: {
      projectName: project,
      deploymentName: deployment,
      verbose: true
    }
  };

  const resp = await axios.post(url, body, {
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/json"
    }
  });

  return resp.data.result.prediction;
}

module.exports = { analyzeMessage };
