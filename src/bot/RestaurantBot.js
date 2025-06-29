const { ActivityHandler } = require("botbuilder");

class RestaurantBot extends ActivityHandler {
    constructor(dialogHandler) {
        super();

        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;
            const result = await dialogHandler.handleMessage(userMessage);

            await context.sendActivity(result);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity("Welcome 👋! I'm your restaurant assistant. Ask me about restaurants, reservations, or placing orders.");
                }
            }
            await next();
        });
    }
}

module.exports = RestaurantBot;