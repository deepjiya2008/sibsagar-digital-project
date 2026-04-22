import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const verboseSqlite = sqlite3.verbose();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for base64 uploads if needed

// 1. Storage Setup for Files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 2. Database Initialization
const dbPath = path.resolve(__dirname, 'archive.db');
const db = new verboseSqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Artifacts Table
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            category TEXT, 
            year INTEGER, 
            summary TEXT, 
            image TEXT,
            content TEXT, 
            infobox TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Pages Table (About, Speech, etc.)
        db.run(`CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY, 
            title TEXT, 
            text TEXT
        )`);

        // Resources Table (PDFs)
        db.run(`CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            author TEXT, 
            type TEXT, 
            url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Admin Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE, 
            password TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    options TEXT, -- Store as JSON string
    correct_answer INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    score INTEGER
)`);

        seedData();
    });
    
}

function seedData() {
    // Default Admin
    db.get("SELECT * FROM users WHERE username = ?", ['admin'], (err, row) => {
        if (!row) {
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', 'admin123']);
            console.log("🔑 Default admin created (admin / admin123)");
        }
    });

    // Default CMS Content
    const defaults = {
        about: { title: "About Project", text: "Sibsagar Digital is a comprehensive effort to digitize, preserve, and showcase the rich heritage of the Ahom Kingdom..." },
        speech: { title: "Authority Speech", text: "The history of Sivasagar is not just the history of a district, but the soul of Assamese identity..." },
        district: { title: "Sivasagar District", text: "Sivasagar, formerly known as Rangpur, was the capital of the Ahom Kingdom from 1699 to 1788..." }
    };

    Object.keys(defaults).forEach(key => {
        db.get("SELECT * FROM pages WHERE id = ?", [key], (err, row) => {
            if (!row) {
                db.run("INSERT INTO pages (id, title, text) VALUES (?, ?, ?)", [key, defaults[key].title, defaults[key].text]);
            }
        });
    });
}

// --- API ROUTES ---

/**
 * ARTIFACTS (ITEMS)
 */
// Get all quizzes
app.get('/api/quizzes', (req, res) => {
    db.all("SELECT * FROM quizzes", [], (err, rows) => {
        const quizzes = rows.map(r => ({ ...r, options: JSON.parse(r.options) }));
        res.json(quizzes);
    });
});

// Admin saves new quiz
app.post('/api/admin/quiz', (req, res) => {
    const { question, options, correct_answer } = req.body;
    db.run("INSERT INTO quizzes (question, options, correct_answer) VALUES (?, ?, ?)", 
    [question, JSON.stringify(options), correct_answer], (err) => {
        res.json({ message: "Quiz added!" });
    });
});

// Save user result
app.post('/api/quiz/submit', (req, res) => {
    const { name, score } = req.body;
    db.run("INSERT INTO quiz_results (user_name, score) VALUES (?, ?)", [name, score]);
    res.json({ message: "Score saved!" });
});
app.get('/api/quiz/results', (req, res) => {
    db.all("SELECT * FROM quiz_results", [], (err, rows) => {
        res.json(rows);
    });
});
// Get quiz results for the leaderboard
app.get('/api/quiz/results', (req, res) => {
    db.all("SELECT user_name, score FROM quiz_results ORDER BY score DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// Get All Artifacts
app.get('/api/items', (req, res) => {
    db.all("SELECT * FROM items ORDER BY year ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse the stringified JSON stored in SQLite
        const items = rows.map(row => ({
            ...row,
            content: JSON.parse(row.content || '[]'),
            infobox: JSON.parse(row.infobox || '[]')
        }));
        res.json(items);
    });
});

// Save New Artifact (Used by Admin Dashboard)
app.post('/api/items', (req, res) => {
    const { title, category, year, summary, image, content, infobox } = req.body;
    
    // Convert JSON objects to strings for SQLite storage
    const contentStr = JSON.stringify(content || []);
    const infoboxStr = JSON.stringify(infobox || []);

    const sql = `INSERT INTO items (title, category, year, summary, image, content, infobox) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [title, category, year, summary, image, contentStr, infoboxStr], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Artifact saved successfully", id: this.lastID });
    });
});

// Delete Artifact
app.delete('/api/items/:id', (req, res) => {
    db.run("DELETE FROM items WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

/**
 * RESOURCES (DOCUMENTS)
 */

// Get All Resources
app.get('/api/resources', (req, res) => {
    db.all("SELECT * FROM resources ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add New Resource (Handles File Upload or URL)
app.post('/api/resources', upload.single('file'), (req, res) => {
    const { title, author, type } = req.body;
    let fileUrl = req.body.url;

    // If a physical file was uploaded via the dashboard
    if (req.file) {
        fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    db.run(
        "INSERT INTO resources (title, author, type, url) VALUES (?, ?, ?, ?)", 
        [title, author, type, fileUrl], 
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Resource added", id: this.lastID, url: fileUrl });
        }
    );
});

/**
 * PAGES (CMS CONTENT)
 */

// Get All Pages (Mapped to object for frontend convenience)
app.get('/api/pages', (req, res) => {
    db.all("SELECT * FROM pages", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Convert array to object format { about: { title, text }, ... }
        const pages = {};
        rows.forEach(row => { 
            pages[row.id] = { title: row.title, text: row.text }; 
        });
        res.json(pages);
    });
});

app.post('/api/pages', (req, res) => {
    const { page, content } = req.body;
    const sql = `INSERT INTO pages (id, title, text) VALUES (?, ?, ?) 
                 ON CONFLICT(id) DO UPDATE SET title=excluded.title, text=excluded.text`;
    db.run(sql, [page, content.title, content.text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Page updated successfully" });
    });
});

/**
 * AUTHENTICATION
 */

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (row) {
            res.json({ token: "session-token-active", user: row.username });
        } else {
            res.status(401).json({ error: "Invalid credentials. Use admin/admin123" });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Backend Server running at http://localhost:${PORT}`);
    console.log(`📁 Uploads served from ${uploadDir}`);
});