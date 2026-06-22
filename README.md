# 🎯 AI Mock Interview Application

An AI-powered mock interview platform that helps students and job seekers prepare for interviews through intelligent question generation, personalized feedback, and performance analysis.

## 🚀 Live Demo


🔗 **Application:** [AI Mock Interview Application](https://ai-mock-interview-application-production.up.railway.app)

---

## 📌 Overview

The AI Mock Interview Application simulates real interview experiences using Artificial Intelligence. Users can participate in technical and HR interviews, answer AI-generated questions, and receive detailed feedback to improve their communication and technical skills.

The platform leverages Google Gemini AI to dynamically generate interview questions and evaluate user responses.

---

## ✨ Features

### 👤 Authentication & User Management

* User Registration
* Secure Login
* JWT Authentication
* Password Encryption
* Profile Management

### 🤖 AI-Powered Interview System

* Technical Interviews
* HR Interviews
* Domain-Based Questions
* Dynamic Question Generation
* Real-Time AI Interaction

### 📊 Performance Evaluation

* AI Feedback
* Strength Analysis
* Weakness Identification
* Improvement Suggestions
* Interview History

### 🎨 User Experience

* Modern Responsive UI
* Mobile-Friendly Design
* Interactive Dashboard
* Fast and Smooth Performance

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* Maven

### Database

* MySQL
* Aiven Cloud Database

### Artificial Intelligence

* Google Gemini API

### Deployment

* Railway
* Aiven MySQL

---

## 📂 Project Structure

```text
AI-Mock-Interview-Application
│
├── frontend
│   ├── app
│   ├── components
│   ├── services
│   ├── public
│   └── styles
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── security
│   ├── dto
│   └── config
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Mock-Interview-Application
```

---

## ⚙️ Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Configure application properties:

```properties
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/mock_interview
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

app.jwt.secret=your_jwt_secret
app.gemini.apiKey=your_gemini_api_key
```

Run backend:

```bash
mvn clean install
mvn spring-boot:run
```

---

## 💻 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key
```

Run frontend:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

### Frontend

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---

## 📸 Screenshots

### 🏠 Home Page

<img width="1902" height="977" alt="image" src="https://github.com/user-attachments/assets/597a4741-29e0-41a6-9879-66cb0b4c083a" />


### 🎤 Interview Dashboard

<img width="1912" height="977" alt="image" src="https://github.com/user-attachments/assets/2eadc5ee-7ac8-4633-a7ac-ed0e7bf2fa76" />


### 📈 Feedback & Performance Analysis
<img width="1907" height="977" alt="image" src="https://github.com/user-attachments/assets/92d34d28-b917-4072-99c0-0f64cf749a68" />

---

## 🔄 Application Workflow

1. User registers or logs in.
2. User selects interview type.
3. Gemini AI generates interview questions.
4. User answers questions.
5. Responses are analyzed.
6. AI generates feedback and scores.
7. Results are stored for future review.

---

## 🎯 Future Enhancements

* Voice-Based Interviews
* Video Interview Support
* Resume Analysis
* Coding Assessment Module
* Multi-Language Support
* AI Career Guidance
* Interview Difficulty Levels
* Leaderboard & Ranking System

---

## 👩‍💻 Author

**V. Sneha Madhuri**

B.Tech – Computer Science Engineering (AI & ML)

Aspiring Software Engineer | AI/ML Enthusiast | Full Stack Developer

### Connect With Me

* GitHub:[https://github.com/SnehaMadhuri11](https://github.com/SnehaMadhuri11)
* LinkedIn:[https://www.linkedin.com/in/sneha-madhuri-vakkalagadda-b1a932309/](https://www.linkedin.com/in/sneha-madhuri-vakkalagadda-b1a932309/)

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📜 License

This project is developed for educational, learning, portfolio, and interview preparation purposes.
