from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import joblib
from datetime import timezone

# Load the trained model
model = joblib.load("sold_ratio_predictor.pkl")

app = Flask(__name__)
CORS(app)

# Recommend discount logic
def recommend_discount(days_to_expiry, sold_ratio):
    if days_to_expiry < 5 and sold_ratio < 0.3:
        return 40
    elif days_to_expiry < 10:
        return 20
    elif sold_ratio < 0.5:
        return 10
    else:
        return 0

# Route 1: Predict Sold Ratio
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    stock = data.get("stock")
    price = data.get("price")
    days = data.get("daysToExpiry", 10)

    pred_ratio = model.predict([[stock, price]])[0]
    discount = recommend_discount(days, pred_ratio)

    return jsonify({
        "predictedSoldRatio": round(pred_ratio, 2),
        "recommendedDiscount": discount
    })

# Route 2: Alert for Excess Stock & Near Expiry
@app.route("/alerts", methods=["POST"])
def alerts():
    items = request.json.get("products", [])
    alerts = []

    for item in items:
        print("🔍 Processing item:", item)
        stock = item["stock"]
        price = item["price"]
        name = item["name"]
        image = item["image"]
        expiry = pd.to_datetime(item["expiryDate"])
        now = datetime.now(timezone.utc)
        days = (expiry - now).days
        print(f"🕒 expiry={expiry}, now={now}, days={days}")

        pred_ratio = model.predict([[stock, price]])[0]
        print(pred_ratio)
       
        if days < 100 and days > 30:
            alerts.append({
                'name': name,
                'image': image,
                'stock': stock,
                'price': price, 
                'daysToExpiry': days,
                'type': 'Near to Expiry',
                'message': f"{name} is near to expiry in {days} days."
            })
        if days < 30 and days > 1:
            alerts.append({
                'name': name,
                'image': image,
                'stock': stock,        
                'price': price, 
                'daysToExpiry': days,
                'type': f'Expiring in {days} days',
                'message': f"{name} is expiring soon in {days} days. Consider discounting or mass selling."
            })    
        if stock > 1000 and days < 10:
            alerts.append({
                'name': name,
                'image': image,
                'stock': stock,        
                'price': price, 
                'daysToExpiry': days,
                'type': 'Excess Stock',
                'message': f"{name} has excess stock of {stock} units."
            })  
        if days < 1:
            alerts.append({
                'name': name,
                'image': image,
                'stock': stock,        
                'price': price, 
                'daysToExpiry': days ,
                'type': 'Expired',
                'message': f"{name} has expired and should be removed from inventory."
            }) 
            
        if pred_ratio < 0.3 and stock > 100 and days < 15:
            alerts.append({
                'name': name,
                'image': image,
                'stock': stock,
                'price': price,
                'daysToExpiry': days,
                'predictedSoldRatio': round(pred_ratio, 2),
                'recommendedDiscount': recommend_discount(days, pred_ratio),
                'type': 'Low Demand',
                'message': f"{name} has low demand with a predicted sold ratio of {round(pred_ratio, 2)}."
            })        
            
           

    return jsonify(alerts)

if __name__ == "__main__":
    app.run(port=5000)
