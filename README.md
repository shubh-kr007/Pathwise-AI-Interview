# 🧭 PathWise
**Your AI-Powered Career Navigator & Interview Coach**

PathWise is an intelligent career development platform designed to help students and professionals crack their dream jobs. It combines **AI Resume Analysis**, **Mock Interviews**, and **Personalized Roadmaps** into a single, cohesive experience.

Unlike generic platforms, PathWise offers real-time, specific feedback using GPT models to analyze your resume and interview performance instantly.

🌐 **Live Frontend:** [https://pathwise-ai-interview-frontend.onrender.com](https://pathwise-ai-interview-frontend.onrender.com)  
⚙️ **Live Backend:** [https://pathwise-ai-interview-backend.onrender.com](https://pathwise-ai-interview-backend.onrender.com)

---

## 🌟 Key Features

### 📄 AI Resume Analyzer
*   Upload your resume (PDF/DOCX).
*   Get an instant **ATS Score** (0-100).
*   Receive detailed feedback on **Strengths, Weaknesses, and Missing Keywords**.
*   Automatically detects your job role (e.g., Frontend Dev, Data Scientist) to tailor your experience.

### 🤖 AI Mock Interviews
*   **Dynamic Questions:** Questions generated in real-time based on the selected topic and mode.
*   **Multiple Modes:**
    *   ✅ **MCQ:** Rapid-fire concept checking.
    *   💻 **Coding:** Write and submit code snippets.
    *   📝 **Quiz:** Open-ended conceptual questions.
*   **10+ Domains:** Technical, Behavioral, System Design, Data Science, and more.
*   **Instant Feedback:** Detailed AI analysis of your answers, including "What went well" and "Areas for improvement."

### 🗺️ Personalized Roadmaps
*   Generates a custom learning path based on your **Resume Analysis**.
*   Step-by-step guide to mastering your specific job role.

### 📊 Smart Dashboard
*   **Progress Tracking:** Visual charts using Recharts to show score improvement over time.
*   **Session Isolation:** Secure, user-specific data management.
*   **Interview History:** Review past attempts and scores.

### 💬 AI Assistant
*   Built-in Chatbot to answer career queries, provide quick tips, and guide you through the app.

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Framer Motion, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, Multer (File Upload) |
| **Database** | MongoDB (Atlas) |
| **AI Engine** | OpenAI API (GPT-3.5 Turbo / GPT-4) |
| **Auth** | JSON Web Tokens (JWT), Google OAuth 2.0 |
| **Deployment** | Render (Static Site + Web Service) |

---

## 🧩 Folder Structure

```bash
PathWise/
├── frontend/               # React (Vite) Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/        # AuthContext & Global State
│   │   ├── pages/          # Main Pages (Dashboard, Interview, Resume, etc.)
│   │   ├── utils/          # API Service, Session Manager
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── backend/                # Node.js Express API
│   ├── config/             # DB Connection
│   ├── middleware/         # Auth & File Handling
│   ├── models/             # Mongoose Schemas (User, InterviewAttempt)
│   ├── routes/             # API Routes (Auth, AI, Resume, Progress)
│   └── server.js           # Entry point
│
└── README.md

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/PathWise.git
cd PathWise
```

### 2️⃣ Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3️⃣ Environment Setup
Create a `.env` file in the **backend/** folder and add:

```
PORT=5000
MONGO_URI=<your_mongo_database_uri>
JWT_SECRET=<your_jwt_secret>
OPENAI_API_KEY=<your_openai_key_if_applicable>
```

### 4️⃣ Run the Project

**Backend**
```bash
npm start
```

**Frontend**
```bash
npm run dev
```

🌐 **Frontend:** http://localhost:5173  
⚙️ **Backend API:** http://localhost:5000/api  

---

## 🧠 API Endpoints (Sample)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET`  | `/api/user/profile` | Fetch user profile |
| `POST` | `/api/progress/save-attempt` | Save test/interview attempt |
| `GET`  | `/api/roadmap/:career` | Get roadmap for a career |
| `POST` | `/api/ai/chat` | AI Chatbot endpoint |

---

## 📘 Usage Flow

1️⃣ **Sign Up / Login**  
2️⃣ **Fill Career Interests & Skills**  
3️⃣ **Get Personalized Recommendations**  
4️⃣ **Explore Roadmaps & Resources**  
5️⃣ **Practice Interviews & Track Progress**  

---

## 🔮 Future Enhancements

- 🌍 Global career & salary insights  
- 🎓 Integration with Coursera / Udemy APIs  
- 📈 AI-powered Resume Analysis  
- 🧭 Career community discussion board  
- 📱 Mobile app (React Native)  

---

## 🤝 Contributing

We ❤️ contributions!  
To contribute:

1. Fork this repository  
2. Create a new branch (`feature/your-feature-name`)  
3. Commit and push your changes  
4. Open a Pull Request 🎉  

---

## 👨‍💻 Developed By

-> Shubh Kumar
-> Mohd. Saqib
-> Rishabh Srivastava



---

## 🪪 License

Licensed under the **MIT License**  
📄 You are free to use, modify, and distribute this project.
