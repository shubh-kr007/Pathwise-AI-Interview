# 🧭 PathWise

> **Your Smart Career Navigator — Powered by AI, Data, and Personalized Insights**

PathWise helps students and professionals **discover the right career path**, analyze **skill gaps**, and follow **AI-generated roadmaps** for success.  
Whether you're planning your first internship, switching careers, or improving your skills — PathWise guides your journey with intelligence and clarity.

🌐 **Live Demo:** [https://pathwise-icin.vercel.app/](https://pathwise-icin.vercel.app/)  
⚙️ **API Backend:** [https://pathwise-j2t6.onrender.com](https://pathwise-j2t6.onrender.com)

---

## 🌟 Features

✅ **AI Career Recommendation Engine** – Discover your ideal roles and industries.  
📊 **Skill Gap Analysis** – Compare your current skills with target career paths.  
🧩 **Interactive Roadmaps** – Visualize step-by-step learning journeys.  
💬 **Mock Interviews + Reports** – Get evaluated with smart feedback.  
📚 **Learning Resource Hub** – Curated tutorials, courses & playlists.  
🧠 **AI Chat Assistant** – Answers to all your career & learning questions.  
📈 **Progress Dashboard** – Track your journey and achievements.  

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| 🎨 **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| ⚙️ **Backend** | ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| 🗄️ **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| 🔐 **Auth & Security** | ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![bcrypt](https://img.shields.io/badge/Bcrypt-4A90E2?style=for-the-badge) |
| 🤖 **AI / NLP** | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![Hugging Face](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black) |
| ☁️ **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white) |

---

## 🧩 Folder Structure

```
PathWise/
├── client/               # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── utils/
│   └── package.json
│
├── server/               # Backend (Node + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── .env.example
├── README.md
└── package.json
```

---

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
Create a `.env` file in the **server/** folder and add:

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



---

## 🪪 License

Licensed under the **MIT License**  
📄 You are free to use, modify, and distribute this project.
