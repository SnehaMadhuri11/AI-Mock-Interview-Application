-- CREATE DATABASE IF NOT EXISTS ai_mock_interview;
-- USE ai_mock_interview;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- 3. Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    score DOUBLE DEFAULT 0.0,
    feedback TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    topic VARCHAR(100),
    difficulty VARCHAR(50),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- 5. Answer Submissions Table
CREATE TABLE IF NOT EXISTS answer_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    answer TEXT NOT NULL,
    technical_score DOUBLE DEFAULT 0.0,
    communication_score DOUBLE DEFAULT 0.0,
    clarity_score DOUBLE DEFAULT 0.0,
    completeness_score DOUBLE DEFAULT 0.0,
    feedback TEXT,
    suggestions TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 6. Interview Results Table
CREATE TABLE IF NOT EXISTS interview_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    technical_score DOUBLE DEFAULT 0.0,
    communication_score DOUBLE DEFAULT 0.0,
    confidence_score DOUBLE DEFAULT 0.0,
    overall_score DOUBLE DEFAULT 0.0,
    feedback TEXT,
    strengths TEXT,
    weaknesses TEXT,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- 7. Resume Analysis Table
CREATE TABLE IF NOT EXISTS resume_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ats_score DOUBLE DEFAULT 0.0,
    extracted_skills TEXT,
    missing_skills TEXT,
    recommendations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
