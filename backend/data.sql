-- Initial Seed Data for AI Mock Interview Application
-- Default Password for both accounts is: Password@123

-- 1. Insert Normal User
INSERT INTO users (id, full_name, email, phone, password, role, active, created_at, updated_at)
VALUES (1, 'Sneha Madhuri', 'sneha@gmail.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_USER', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;

-- 2. Insert Admin User
INSERT INTO users (id, full_name, email, phone, password, role, active, created_at, updated_at)
VALUES (2, 'System Admin', 'admin@aimockinterview.com', '9999999999', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_ADMIN', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;
