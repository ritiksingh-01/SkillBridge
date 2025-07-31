<div align="center">

# 🌉 **SkillBridge – The Ultimate Mentor Hub**

### *Connecting Dreams with Experience*

A powerful, modern, and intuitive mentorship platform that bridges the gap between aspiring mentees and experienced mentors.

</div>

<p align="center">
  <img src="https://img.shields.io/github/license/ritiksingh-01/SkillBridge?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square" />
</p>

---

<div align="center">

> **SkillBridge empowers mentorship with live chat, secure booking, role-based dashboards, instant notifications, and a seamless experience across devices.**

</div>

---

## 🚀 **Why SkillBridge?**

- **Find your perfect mentor** with smart search and advanced filters.
- **Book sessions in real-time** with seamless scheduling & availability management.
- **Chat instantly** and exchange resources in a secure, feature-rich chat.
- **Experience tailored dashboards** for both mentors & mentees.
- **Pay securely** and get transparent feedback with Stripe integration & reviews.

---

## ✨ **Feature Overview**

<div align="center">

<table>
  <tr>
    <td align="center"><b>🔐<br>Role-based Auth</b></td>
    <td align="center"><b>🧑‍🏫<br>Mentor Discovery</b></td>
    <td align="center"><b>📅<br>Live Scheduling</b></td>
    <td align="center"><b>💬<br>Instant Chat</b></td>
    <td align="center"><b>💳<br>Payments</b></td>
    <td align="center"><b>🌟<br>Ratings</b></td>
  </tr>
  <tr>
    <td>Mentor/Mentee login, protected routes</td>
    <td>Smart search, profile filters</td>
    <td>Book, reschedule, manage sessions</td>
    <td>File sharing, real-time notifications</td>
    <td>Stripe integration, secure flows</td>
    <td>Transparent feedback & reviews</td>
  </tr>
</table>

</div>

---

## 🛠️ **Tech Stack**

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?logo=socket.io" />
  <img src="https://img.shields.io/badge/Stripe-635bff?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens" />
</div>

---

## ⚡ **Quick Start**

### 🔧 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 🔥 Backend

```bash
cd server
npm install
cp .env.example .env  # Edit this file with your credentials
npm run dev
```

### 🎨 Frontend

```bash
cd ..
npm install
cp .env.example .env  # Set VITE_API_URL
npm run dev
```

> **Backend:** `http://localhost:5000`  
> **Frontend:** `http://localhost:5173`

---

## 🗂️ **Project Highlights**

- **JWT Authentication** | **Role-based Dashboards** | **Live Chat & Socket.io**
- **Secure Stripe Payments** | **Rich Mentor Directory** | **Feedback & Rating System**
- **Responsive UI** | **RESTful API** | **Email & Push Notifications**

---

## 📚 **Core API Endpoints**

| Area            | Method & Route                      | Description                  |
|-----------------|-------------------------------------|------------------------------|
| Auth            | `POST /api/auth/login`              | User login                   |
|                 | `POST /api/auth/register`           | User registration            |
| Users           | `GET /api/users/profile`            | Profile view                 |
|                 | `PUT /api/users/profile`            | Update profile               |
| Mentors         | `GET /api/mentors`                  | List mentors                 |
|                 | `POST /api/mentors/apply`           | Apply to be a mentor         |
|                 | `PUT /api/mentors/profile`          | Update mentor profile        |
| Sessions        | `POST /api/sessions`                | Book session                 |
|                 | `GET /api/sessions`                 | Get sessions                 |
|                 | `PUT /api/sessions/:id/status`      | Update session status        |
| Messages        | `POST /api/messages`                | Send a message               |
|                 | `GET /api/messages/:sessionId`      | Get session messages         |

---

## 👥 **Contributors**

<div align="center">

<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/ritiksingh-01">
        <img src="https://github.com/ritiksingh-01.png" width="120px;" alt="Ritik Singh" style="border-radius: 50%;"/>
        <br />
        <sub><b>Ritik Singh</b></sub>
      </a>
      <br />
      <em>Project Lead & MERN Stack Developer</em>
      <br />
      <small>💻 Architecture • 🎨 UI/UX • ⚡ Performance</small>
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/priyanshibhargava-12">
        <img src="https://github.com/priyanshibhargava-12.png" width="120px;" alt="Priyanshi" style="border-radius: 50%;"/>
        <br />
        <sub><b>Priyanshi</b></sub>
      </a>
      <br />
      <em>Frontend Developer</em>
      <br />
      <small>🎨 Design Systems • 📱 Responsive • 💫 Animations</small>
    </td>
  </tr>
</table>

*We're always looking for passionate contributors to join our mission!*

</div>

---

## 🤝 **How to Contribute**

1. **Fork** the repository  
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`  
3. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`  
4. **Push** to the branch: `git push origin feature/AmazingFeature`  
5. **Open a Pull Request**  

### 💡 Want ideas?
- 🐛 Bug fixes & improvements
- ✨ New features
- 📚 Documentation
- 🎨 UI/UX enhancements
- 🧪 Tests

---

## 🌐 **Connect & Support**

- **GitHub:** [@ritiksingh-01](https://github.com/ritiksingh-01)
- **LinkedIn:** [Ritik Singh](https://linkedin.com/in/ritik-singh)

> If you love SkillBridge, ⭐ star the repo, 🍴 fork it, 🐛 report bugs, or 💡 suggest features!

---

## 📄 **License**

Licensed under the [MIT License](LICENSE).

<div align="center">

---

*© 2024 SkillBridge. Empowering mentorship, one connection at a time.*

[⬆️ Back to Top](#-skillbridge--the-ultimate-mentor-hub)

</div>
