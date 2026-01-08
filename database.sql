-- Create Database
CREATE DATABASE IF NOT EXISTS sibsagar_db;
USE sibsagar_db;

-- 1. Users Table (Admin Access)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store BCrypt hashes, not plain text
    role ENUM('admin', 'editor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Artifacts (Main Table)
CREATE TABLE artifacts (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'rang-ghar'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'kings', 'architecture', etc.
    year INT,
    summary TEXT,
    main_image_url TEXT,
    lineage_order INT DEFAULT 999, -- For sorting kings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Content Sections (Wikipedia Style Dynamic Rows)
CREATE TABLE artifact_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artifact_id VARCHAR(50),
    header VARCHAR(255),
    content TEXT,
    image_url TEXT,
    caption VARCHAR(255),
    section_order INT, -- To keep sections in correct sequence
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

-- 4. Infobox Data (Key-Value Pairs)
CREATE TABLE artifact_infobox (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artifact_id VARCHAR(50),
    label VARCHAR(100),
    value VARCHAR(255),
    row_order INT,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

-- 5. Resources (PDFs & Papers)
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    type VARCHAR(50), -- 'Academic Paper', 'Report'
    file_path TEXT, -- Path to uploaded PDF
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CMS Pages (About, Speech, District Info)
CREATE TABLE cms_pages (
    page_key VARCHAR(50) PRIMARY KEY, -- 'about', 'speech', 'district'
    title VARCHAR(255),
    content MEDIUMTEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (Initial Content)
-- ==========================================

INSERT INTO cms_pages (page_key, title, content) VALUES
('about', 'About Project', 'Sibsagar Digital is a comprehensive effort to digitize...'),
('speech', 'Authority Speech', 'The history of Sivasagar is not just the history of a district...'),
('district', 'Sivasagar District', 'Sivasagar, formerly known as Rangpur, was the capital...');

INSERT INTO artifacts (id, title, category, year, summary, main_image_url, lineage_order) VALUES
('sukaphaa', 'Chaolung Sukaphaa', 'kings', 1228, 'The founder of the Ahom Kingdom...', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Sukaphaa.jpg/640px-Sukaphaa.jpg', 1);