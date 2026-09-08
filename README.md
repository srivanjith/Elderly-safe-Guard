# 🛡️ SafePay Guardian

> **Tagline:** Protecting vulnerable users before the money leaves.

SafePay Guardian is an AI-powered digital payment protection platform designed to help elderly and vulnerable users avoid financial scams. When an unusual or suspicious high-value payment is initiated, the system analyzes the transaction using a hybrid fraud risk engine. If considered high-risk, the payment is placed on temporary hold in Redis and a trusted guardian receives a real-time approval request via WebSockets. The guardian can approve or block the transaction before funds leave the user's wallet.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP & WebSockets**: Axios, Socket.io-client

### Backend
- **Runtime**: Node.js & Express.js
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose
- **Cache & Holds**: Redis & ioredis
- **Real-Time Communication**: Socket.IO
- **Security**: JWT, bcrypt, Helmet, CORS, express-rate-limit, Zod

### AI / ML Fraud Microservice
- **Framework**: Python 3.10 + FastAPI + Uvicorn
- **ML Engine**: Scikit-Learn (Isolation Forest anomaly detection)
- **Data Processing**: Pandas, NumPy, Joblib, Pydantic

---

## 📁 Monorepo Structure

```
safepay-guardian/
├── frontend/             # Next.js 14 Client App (Elderly, Guardian & Admin UIs)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/              # Express.js TypeScript Backend & Socket.IO Server
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── server.ts
│   └── package.json
├── ml-service/           # FastAPI Machine Learning Fraud Engine
│   ├── app/
│   │   ├── main.py
│   │   ├── risk_engine.py
│   │   ├── model.py
│   │   └── schemas.py
│   └── requirements.txt
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🔑 Demo Account Credentials

The system comes pre-configured with demo accounts and sample transaction logs.

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| 👴 **Elderly User** | `elderly@safepay.demo` | `Demo123!` | Wallet Balance: ₹1,50,000 |
| 🛡️ **Guardian** | `guardian@safepay.demo` | `Demo123!` | Assigned Primary Son |
| 👑 **Admin** | `admin@safepay.demo` | `Demo123!` | System Analytics Portal |

---

## 🛠️ Local Development Setup

### 1. Requirements
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (or local MongoDB Community edition)
- Redis (optional; in-memory fallback enabled automatically if offline)

### 2. Install Dependencies & Start Services

#### Backend Service
```bash
cd backend
npm install
npm run seed     # Populates demo accounts & transactions
npm run dev      # Starts Express server on http://localhost:5000
```

#### ML Fraud Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend Application
```bash
cd frontend
npm install
npm run dev      # Starts Next.js app on http://localhost:3000
```

---

## 🐳 Docker Support

To run the entire monorepo using Docker Compose:

```bash
docker-compose up --build
```

Services exposed:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379

---

## 📡 REST API Summary

### Auth
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Fetch profile

### Transactions & Risk Engine
- `POST /api/transactions` - Process payment & analyze fraud risk
- `GET /api/transactions` - Fetch transaction history
- `POST /api/transactions/:id/analyze` - Perform instant risk score check

### Guardian Actions
- `GET /api/guardian/pending` - Fetch held transactions awaiting review
- `POST /api/guardian/transactions/:id/approve` - Approve payment & complete transfer
- `POST /api/guardian/transactions/:id/block` - Block high-risk payment & cancel

### Admin Analytics
- `GET /api/admin/analytics` - System metrics, prevented fraud totals & Recharts dataset

---

## ⚠️ Simulation Disclaimer
SafePay Guardian is a working demonstration and payment protection prototype. It is NOT connected to real production banking or UPI infrastructure. No real financial credentials or card details are collected or processed.
