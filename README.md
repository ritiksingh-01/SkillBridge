<div align="center">

# 🌉 **SkillBridge – The Modern Mentorship Platform**

### *Connecting Dreams with Experience*

A full-stack mentorship and career guidance web platform bridging aspiring mentees and experienced mentors with real-time communication, secure session scheduling, role-based dashboards, and integrated payments.

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_7-4EA94B?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io" />
  <img src="https://img.shields.io/badge/Stripe-API-635bff?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>

---

## 🚀 **Key Features**

- **Find Your Perfect Mentor**: Smart search and faceted filtering by skills, categories, and price ranges.
- **Role-Based Authentication & Authorization**: Hardened JWT-based authentication with bcrypt-hashed passwords and role verification (`mentee`, `mentor`, `admin`).
- **Real-Time Interactive Chat**: Real-time messaging powered by Socket.io with JWT handshake authorization and room isolation.
- **Session Booking & Lifecycle**: Full lifecycle tracking (`pending` ➔ `confirmed` ➔ `completed` / `cancelled`), preventing self-booking and enforcing mentor availability.
- **Dedicated Dashboards**:
  - **Mentee Dashboard**: Real-time overview of active sessions, upcoming meetings, mentor recommendations, and learning goals.
  - **Mentor Dashboard**: Real-time statistics on total sessions, active mentees, reviews/rating recalculations, and total earnings.
- **Transparent Ratings & Reviews**: Automatic rating aggregation using MongoDB atomic updates upon session completion.
- **Secure Stripe Integration**: Raw body webhook signature verification for real-time payment settlement and session confirmation.
- **Real-Time Notifications**: Multi-channel notifications for bookings, status changes, incoming messages, and payment alerts.

---

## 🛠️ **Tech Stack**

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, React Router 7, Framer Motion, Lucide Icons, FontAwesome, Axios, Socket.io Client.
- **Backend**: Node.js, Express 4, MongoDB (Mongoose 7), Socket.io, Stripe, Helmet, Express Rate Limit, JWT, Jest, Supertest.

---

## ⚡ **Quick Start**

### 🔧 Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- npm or pnpm

### 1️⃣ Clone and Setup Root

```bash
git clone https://github.com/ritiksingh-01/SkillBridge.git
cd SkillBridge
npm install
```

### 2️⃣ Configure Backend Environment

```bash
cd server
cp .env.example .env
npm install
```

Update `server/.env` with your secrets:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3️⃣ Start Development Servers

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
# In the repository root
npm run dev
```

- **Frontend UI:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

## 🧪 **Testing & Quality Assurance**

- **Run Frontend & Backend Linter:**
  ```bash
  npm run lint
  ```
- **Run Production Build:**
  ```bash
  npm run build
  ```
- **Run Backend Integration & Unit Tests:**
  ```bash
  npm --prefix server test
  ```

---

## 🔒 **Security & Architectural Enhancements**

The platform has been audited and hardened according to rigorous security best practices:
1. **Zero Credential Exposure**: Live credentials and connection strings removed from source control and `.env.example`.
2. **Cryptographic Token Verification**: Eliminates unverified token shortcuts; all API routes and WebSocket handshakes enforce standard cryptographic JWT verification.
3. **Strict Mentor Application Flow**: Applications require administrative approval (`isVerified: false`, `applicationStatus: 'pending'`).
4. **Isolated Chat & Participant Verification**: Sockets and REST endpoints strictly verify that a user is an authorized participant before transmitting messages.
5. **Raw Stripe Webhook Verification**: Dedicated raw body middleware handler prevents JSON body tampering and ensures webhook signature integrity.
6. **NoSQL / ReDoS / Rate Limit Hardening**: Search queries escape special regex characters, endpoints enforce pagination caps, and sensitive auth routes feature strict rate limiters.
7. **Clean Linux/Docker Compatibility**: All case-sensitive component imports normalized for seamless cross-platform deployment.

---

## 📚 **Core API Routes**

| Domain | Method & Route | Access | Description |
|---|---|---|---|
| **Auth** | `POST /api/auth/register` | Public | Register mentee or mentor |
| | `POST /api/auth/login` | Public | Authenticate user & issue JWT |
| | `GET /api/auth/me` | Authenticated | Validate session and fetch current user |
| | `PUT /api/auth/change-password` | Authenticated | Update user password |
| **Mentors** | `GET /api/mentors` | Public | Query verified mentors with filters |
| | `GET /api/mentors/dashboard/stats` | Mentor | Retrieve mentor metrics & statistics |
| | `GET /api/mentors/:id` | Public | Fetch public mentor profile |
| | `POST /api/mentors/apply` | Authenticated | Submit mentor application |
| **Sessions** | `GET /api/sessions` | Authenticated | Fetch sessions for current user/mentor |
| | `POST /api/sessions` | Mentee | Book new session |
| | `PUT /api/sessions/:id/status` | Authenticated | Update session lifecycle status |
| **Messages** | `GET /api/messages/:sessionId` | Participant | Retrieve chat history for session |
| | `POST /api/messages` | Participant | Post new message in session |
| **Payments** | `POST /api/payments/create-intent` | Mentee | Generate Stripe payment intent |
| | `POST /api/payments/webhook` | Stripe | Secure webhook event receiver |

---

## 📄 **License**

This project is licensed under the [MIT License](LICENSE).
