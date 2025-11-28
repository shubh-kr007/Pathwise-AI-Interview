# 🧭 PathWise
**Your AI-Powered Career Navigator & Interview Coach**

PathWise is an intelligent career development platform designed to help students and professionals crack their dream jobs. It combines **AI Resume Analysis**, **Mock Interviews**, and **Personalized Roadmaps** into a single, cohesive experience.

Unlike generic platforms, PathWise offers real-time, specific feedback using GPT models to analyze your resume and interview performance instantly.

🌐 **Live Frontend:** [https://pathwise-frontend.onrender.com](https://pathwise-frontend.onrender.com)  
⚙️ **Live Backend:** [https://pathwise-backend.onrender.com](https://pathwise-backend.onrender.com)

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
⚙️ Installation & Setup
1️⃣ Clone the Repository
Bash

git clone https://github.com/<your-username>/PathWise.git
cd PathWise
2️⃣ Backend Setup
Bash

cd backend
npm install
Create a .env file in the backend/ folder:

env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-proj-your-openai-key
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
Run the server:

Bash

npm run dev
3️⃣ Frontend Setup
Open a new terminal:

Bash

cd frontend
npm install
Create a .env file in the frontend/ folder:

env

VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
Run the client:

Bash

npm run dev
🚀 App is now running at: http://localhost:5173

🧠 Key API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Create a new user account
POST	/api/resume/analyze	Upload & analyze resume (Multipart/Form-Data)
POST	/api/ai/generate-questions	Generate fresh interview questions via AI
POST	/api/ai/interview-feedback	Get AI feedback on interview answers
POST	/api/progress/save-attempt	Save interview score & history
GET	/api/user/profile	Get user stats and details
🔮 Future Enhancements
🎤 Voice Interviews: Speech-to-Text integration for real-time oral answers.
📹 Video Analysis: Body language and confidence analysis.
🤝 Community Hub: A space for users to share roadmaps and tips.
📱 Mobile App: React Native version for learning on the go.
🤝 Contributing
This is a college project actively under development! We welcome feedback and contributions.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
👨‍💻 Developed By
Team PathWise

Rishabh Srivastava - Frontend Lead
Mohd. Saqib - Auth & Security Lead
Shubh Kumar - Backend & API Lead
🪪 License
Licensed under the MIT License.
Free for educational and personal use.






