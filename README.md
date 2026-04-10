StockSim 📈
A full-stack virtual stock trading platform built with Node.js, Express, MySQL, and EJS. Users get ₹1,00,000 virtual money to trade real NSE-listed stocks using live prices fetched from the Yahoo Finance API.


🔗 Live Demo: https://stocksim-1-ty4c.onrender.com

Features

🔐 JWT Authentication — Secure register/login with bcrypt password hashing and httpOnly cookie storage
📊 Live Stock Prices — Real NSE stock prices fetched from Yahoo Finance API
💹 Buy & Sell Stocks — Full trading flow with balance validation and weighted average buy price calculation
📁 Portfolio Tracking — Real-time P&L, current value vs invested value per stock
🏆 Leaderboard — All users ranked by net worth (cash + portfolio value)
📋 Transaction History — Complete log of every buy and sell with timestamps
👀 Watchlist — Monitor stocks without buying them
💰 Net Worth Tracking — Balance + live portfolio value updated in real time


Tech Stack
LayerTechnologyBackendNode.js, 
Express.jsFrontendEJS (server-side rendering), 
CSSDatabaseMySQLAuthenticationJWT,
bcryptjsExternal APIYahoo Finance (NSE live prices)DeploymentRender (server), 
Clever Cloud (MySQL)

Project Structure
stocksim/
├── config/
│   └── db.js               # MySQL connection pool
├── controllers/
│   ├── authcontroller.js   # Register, login, logout
│   ├── stockcontroller.js  # Search, buy, sell, dashboard
│   ├── portfoliocontroller.js
│   ├── leaderboardcontroller.js
│   ├── transactioncontroller.js
│   └── watchlistcontroller.js
├── middleware/
│   └── authmiddleware.js   # JWT verification
├── models/
│   ├── usermodel.js        # User SQL queries
│   └── stockmodel.js       # Holdings, transactions, watchlist queries
├── routes/                 # Express routers
├── services/
│   └── stockservice.js     # Yahoo Finance API integration
├── views/                  # EJS templates
│   ├── partials/           # Navbar, header, footer
│   ├── auth/               # Login, register
│   └── stocks/             # Search, buy, sell
├── public/css/style.css    # Stylesheet
├── app.js                  # Entry point
└── .env                    # Environment variables (not committed)


Database Schema
sqlusers        — id, name, email, password_hash, balance, created_at
holdings     — id, user_id, symbol, quantity, avg_buy_price
transactions — id, user_id, symbol, type, quantity, price_at_time, total_amount, created_at
watchlist    — id, user_id, symbol

Key Implementation Details
Average Buy Price Calculation
When a user buys the same stock multiple times at different prices, a weighted average is calculated:
new_avg = (old_qty × old_avg + new_qty × new_price) / total_qty

JWT Auth Flow

Password hashed with bcrypt (10 salt rounds) before storing
JWT signed with secret key on login, stored in httpOnly cookie
Auth middleware verifies token on every protected route

Live Price Fetching

Yahoo Finance unofficial API — no API key required
.NS suffix for NSE listed stocks (e.g. RELIANCE.NS)
Portfolio uses Promise.all to fetch all prices in parallel


Running Locally
Prerequisites

Node.js v18+
MySQL

Setup
bash# Clone the repo
git clone https://github.com/shivamm-15/Stocksim.git
cd Stocksim

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your MySQL credentials and JWT secret

# Create database and tables
mysql -u root -p
CREATE DATABASE stocksim;
USE stocksim;
# Run the CREATE TABLE statements from schema.sql

# Start development server
npm run dev
Environment Variables
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stocksim
JWT_SECRET=your_secret_key

Screenshots

Register and login with a clean, centered form
<img width="1915" height="960" alt="image" src="https://github.com/user-attachments/assets/f26d11d4-3248-417f-b329-306f9c68c9e0" />

<img width="1951" height="957" alt="image" src="https://github.com/user-attachments/assets/fce2dc73-d19c-4a60-9d0b-aaa37b1dce01" />


Dashboard showing balance and popular NSE stock shortcuts
<img width="1912" height="902" alt="image" src="https://github.com/user-attachments/assets/738ea881-327b-44fc-a6d6-3d2b936e6c0e" />


Search any NSE stock by symbol and see live price
<img width="1892" height="970" alt="image" src="https://github.com/user-attachments/assets/274a23f2-8273-4ef7-a997-a60af650f49c" />
<img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/cf531970-a42f-4c3a-82b9-7b85dc171a21" />


Buy stocks with real-time total cost calculation
<img width="1905" height="907" alt="image" src="https://github.com/user-attachments/assets/318d5e4b-a08d-441f-bad5-9e2f24461933" />


Portfolio page with per-stock P&L and overall net worth
<img width="1917" height="898" alt="image" src="https://github.com/user-attachments/assets/840439b8-a421-4b06-832d-3b0926345737" />


Leaderboard ranking all users by net worth
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/7928ca3d-d118-415e-86ac-17d7909405ae" />


Transaction history with colour-coded buy/sell badges
<img width="1918" height="893" alt="image" src="https://github.com/user-attachments/assets/c3b1fb57-4ee4-4c06-921e-9f9140352b20" />


Watchlist to monitor stocks without buying
<img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/d982e213-ed6a-4b9c-acb6-c0cf94050364" />


Live Demo
Try it out at https://stocksim-1-ty4c.onrender.com

Note: Hosted on Render free tier — first load may take 30-60 seconds if the server has been idle.


Author
Shivam Mishra — 2nd Year B.Tech CS (AI)
Portfolio • GitHub • LinkedIn
