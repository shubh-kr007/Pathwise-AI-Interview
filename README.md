# 🧭 PathWise AI

<p align="center">
  <a href="https://pathwise-ai-interview-frontend.onrender.com"><strong>🚀 LIVE DEMO</strong></a>
</p>

<p align="center">
  <img src="frontend/public/pathwise-mockup.png" alt="PathWise AI Showcase" width="100%">
</p>

<p align="center">
  <a href="#-key-features"><strong>Features</strong></a> | 
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> | 
  <a href="#-folder-structure"><strong>Folder Structure</strong></a> | 
  <a href="#-installation--setup"><strong>Installation</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
</p>

---

### **Your AI-Powered Career Navigator & Interview Coach**

**PathWise** is an intelligent career development platform designed to help students and professionals crack their dream jobs. It combines **AI Resume Analysis**, **Mock Interviews**, and **Personalized Roadmaps** into a single, cohesive experience.

---

## 🌟 Key Features

### 📄 AI Resume Analyzer
*   **ATS Scoring:** Upload your resume (PDF/DOCX) and get an instant **ATS Score** (0-100).
*   **Deep Insights:** Receive detailed feedback on **Strengths, Weaknesses, and Missing Keywords**.
*   **Context Aware:** Automatically detects your job role to tailor your experience.

### 🤖 AI Mock Interviews
*   **Dynamic Questions:** Questions generated in real-time based on the selected topic and mode.
*   **Multiple Modes:**
    *   ✅ **MCQ:** Rapid-fire concept checking.
    *   💻 **Coding:** Write and submit code snippets.
    *   📝 **Quiz:** Open-ended conceptual questions.
*   **10+ Domains:** Technical, Behavioral, System Design, Data Science, and more.
*   **Instant Feedback:** Detailed AI analysis of your answers.

### 🗺️ Personalized Roadmaps
*   **Custom Paths:** Generates a custom learning path based on your **Resume Analysis**.
*   **Step-by-Step:** A guided journey to mastering your specific job role.

### 📊 Smart Dashboard
*   **Progress Tracking:** Visual charts using **Recharts** to show score improvement over time.
*   **Session Isolation:** Secure, user-specific data management.
*   **Interview History:** Review past attempts and scores.

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Framer Motion, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, Multer (File Handling) |
| **Database** | MongoDB (Atlas) |
| **AI Engine** | OpenAI API (GPT-4 / GPT-3.5) |
| **Auth** | JWT, Google OAuth 2.0 |
| **Deployment** | Render / Vercel |

---

## 📂 Folder Structure

```bash
PathWise/
├── frontend/               # React (Vite) Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext & Global State
│   │   ├── pages/          # Main Pages
│   │   ├── utils/          # API Service, Session Manager
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── backend/                # Node.js Express API
│   ├── config/             # DB Connection
│   ├── middleware/         # Auth & File Handling
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   └── server.js           # Entry point
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/shubh-kr007/Pathwise-AI-Interview.git
cd Pathwise-AI-Interview
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
# Create a .env file with your credentials
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
# Create a .env file with your API URL
npm run dev
```

---

## 👨‍💻 Developed By

**Team PATHWISE**
- **Shubh Kumar** - [GitHub](https://github.com/shubh-kr007)
- **Mohd. Saqib** - [GitHub](https://github.com/MohdSaqib)
- **Rishabh Srivastava** - [GitHub](https://github.com/Rishabh-Srivastava)

---

## 🪪 License

Licensed under the **MIT License**. Free for educational and personal use.
📄 You are free to use, modify, and distribute this project.
