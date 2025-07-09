# 🍴 Restaurant Bot

A conversational restaurant assistant built with MERN stack and Azure Conversational Language Understanding (CLU). Users can:

- 🔎 Search by cuisine & location  
- 📋 Browse menus with descriptions, prices & images  
- ⭐ Read customer reviews  
- 📱 Place pickup & delivery orders  
- 🗓️ Make, view, modify & cancel reservations  
- ⏳ Track order status (for now its automated through “Received → Preparing → … → Delivered” )
- 💳 Make mock payments (for now there's no real transactions)  

Frontend deployed on Vercel:  
**🔗 https://restaurant-bot-frontend.vercel.app/**

---

## 📦 Tech Stack

- **Backend**: Node.js, Express, Mongoose (MongoDB Atlas)   
- **NLP**: Azure Conversational Language Understanding (CLU)  
- **Scheduler**: `setInterval`-driven order status automation  
- **Frontend**: React (CRA), Fetch API  
- **Deployment**:  
  - Backend → Azure App Service (Linux, Node 20 LTS)  
  - Frontend → Vercel  
- **CI/CD**: GitHub Actions

---

## 🚀 Features

1. **SearchRestaurant**  
   - Intent: “Find South Indian in Koramangala”  
   - Entities: cuisine[], location[] (currently supported — more entities like restaurantName, priceRange, etc. will be added soon)
   - Returns top‑10 results sorted by votes & rating   

2. **Ordering**  
   - Add/remove via `+`/`–` buttons  
   - Summary & mock “payment” flow  
   - Orders saved in MongoDB with status history  

3. **ManageOrders**  
   - Intent: “Show my orders”  
   - Prompts for email, shows last 10 orders  
   - Inline edit/cancel support  

4. **Reservations**  
   - Intent: “Book a table at Sagar Deluxe”  
   - Prompts for user details, party size, special requests  
   - View, edit, cancel existing reservations   

---

## 🔧 Prerequisites

- Node.js 20+  
- MongoDB Atlas (or local Mongo)  
- Azure subscription with CLU resource  
- Vercel account for frontend

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/Vedant-07/Restaurant_bot.git
cd restaurant-bot
```

### 2. Backend

```bash
npm install
```

Update `.env`:

```env
MONGODB_URI=<your-mongo-uri>
AZURE_ENDPOINT=https://<your-clu-endpoint>.cognitiveservices.azure.com
AZURE_KEY=<your-clu-key>
PROJECT_NAME=restaurant-bot
DEPLOYMENT_NAME=production
PORT=8000
```

### 3. Azure CLU Setup

- Create a CLU resource in Azure
- In [CLU Studio](https://language.cognitive.azure.com/clu), create a project `restaurant-bot`
- Add **Intents**:
  - `SearchRestaurant`, `ManageOrders`, `ManageReservations`
- Add **Entities**:
  - `cuisine`, `location`, `objectType`, `action`
- Train and deploy to `production`
- Copy `Endpoint` and `Key` into `.env`

### 4. Run Backend

```bash
npm run start
```

The status scheduler starts automatically after MongoDB connects.

### 5. Frontend

```bash
git clone https://github.com/Vedant-07/Restaurant_bot_frontend.git
```

Update `.env`:

```env
REACT_APP_API_BASE=http://localhost:8000
```

Start:

```bash
npm run start
```

---

## 📡 Deployment

### Backend → Azure App Service

1. Create an App Service (Linux, Node.js 20 LTS)
2. Upload your backend code or deploy via GitHub Actions
3. Add environment variables under App Settings
4. Enable CORS for:
   - `https://restaurant-bot-frontend.vercel.app`

### Frontend → Vercel

1. Connect Vercel to your GitHub repo
2. Choose the `frontend/` folder as root
3. Add environment variable:
   - `REACT_APP_API_BASE=https://<your-backend-url>`
4. Deploy!

---

## 📖 API Reference

### 🔹 Chat

`POST /api/chat`

```json
{
  "message": "Show my orders",
  "email": "you@example.com"
}
```

---

### 🔹 Restaurant Info

`GET /api/restaurant/:id`

Returns: `menu[]`, `reviews[]`

---

### 🔹 Orders

- `POST /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id`
- `DELETE /api/orders/:id`

---

### 🔹 Reservations

- `POST /api/reservations`
- `GET /api/reservations?email=you@example.com`
- `PATCH /api/reservations/:id`
- `DELETE /api/reservations/:id`

---

## 🎯 Future Improvements

- JWT-based Authentication  
- Stripe/PayPal integration  
- Push/email notifications  
- Admin dashboard for analytics  
- Rich adaptive cards in Bot responses

---

**Thanks for visiting Restaurant Bot!** 🍽️  
Pull requests, issues, and ⭐️ stars are always welcome!
