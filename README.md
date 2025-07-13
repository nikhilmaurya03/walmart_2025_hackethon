🛒 Retail Inventory Alert & Discount Recommendation System

This is a smart retail inventory management web application that helps retailers optimize stock, reduce wastage, and maximize profit by identifying products that are:

Nearing expiry

Overstocked

Unsold or slow-moving

It uses AI/ML prediction, MongoDB, Express, Flask, and React (MERN + Python) to generate actionable alerts and recommend dynamic discounts.

🔍 Features
✅ Smart Alerts: Automatically detects products that are:

Expiring soon

Already expired

Overstocked beyond predicted sale ratio

✅ Dynamic Discount Suggestions: Suggests discount rates based on predicted sold ratio and expiry date proximity.

✅ Beautiful UI Dashboard:

Alert cards with icons, colors, and product images

Sorted and categorized views

Responsive layout

✅ ML Integration:

Uses trained regression model (.pkl file)

Predicts sold ratio using features like stock and price

✅ Tech Stack:

🟦 Frontend: React.js

🟨 Backend: Node.js + Express

🐍 ML API: Flask

🍃 Database: MongoDB

🔐 Security
CORS enabled between Flask and Express

Error handling for bad data and failed predictions

Steps to Run Project:--
1. git clone https://github.com/nikhilmaurya03/walmart_2025_hackethon.git
    cd walmart_2025_hackethon
2. cd ml
    pip install flask flask-cors pandas scikit-learn joblib
    python ml_api.py
   
3. cd backend
    npm install
    node index.js

4. cd frontend
    npm install
    npm start

📸 Screenshots
<img width="1914" height="1030" alt="Screenshot 2025-07-13 133037" src="https://github.com/user-attachments/assets/27bf64ab-f50b-4b43-ad39-9788d64c53e7" />
<img width="1906" height="986" alt="Screenshot 2025-07-13 133059" src="https://github.com/user-attachments/assets/2873e554-1576-4ddc-8601-c83e55db50c2" />
<img width="1916" height="1033" alt="Screenshot 2025-07-13 133014" src="https://github.com/user-attachments/assets/d9b32993-e000-4d8f-83fb-cdce90262388" />

