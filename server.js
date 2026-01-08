const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ==========================================
// MOCK DATA / SEED DATA
// ==========================================
const INITIAL_DATA = [
  {
    id: 'sukaphaa',
    title: 'Chaolung Sukaphaa',
    category: 'kings',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Sukaphaa.jpg/640px-Sukaphaa.jpg',
    summary: 'The founder of the Ahom Kingdom who established his capital at Charaideo in 1228 CE.',
    year: 1228,
    lineage_order: 1,
    content: [],
    infobox: []
  },
  {
    id: 'rang-ghar',
    title: 'Rang Ghar',
    category: 'architecture',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rang_Ghar_Sivasagar.jpg/640px-Rang_Ghar_Sivasagar.jpg',
    summary: 'A two-storied royal sports pavilion in Sivasagar, often referred to as the oldest amphitheater in Asia.',
    year: 1746,
    content: [],
    infobox: []
  },
  {
    id: 'saraighat',
    title: 'Battle of Saraighat',
    category: 'wars',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Lachit_Borphukan_Statue.jpg/640px-Lachit_Borphukan_Statue.jpg',
    summary: 'A decisive naval battle fought in 1671 between the Mughal Empire and the Ahom Kingdom.',
    year: 1671,
    content: [],
    infobox: []
  },
  {
      id: 'maidams',
      title: 'Charaideo Maidams',
      category: 'architecture',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maidam_at_Charaideo.jpg/640px-Maidam_at_Charaideo.jpg',
      summary: 'The royal burial mounds of the Ahom kings, comparable to the Pyramids of Egypt.',
      year: 1253,
      content: [],
      infobox: []
  },
  {
    id: 'talatal-ghar',
    title: 'Talatal Ghar',
    category: 'architecture',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Talatal_Ghar.jpg/640px-Talatal_Ghar.jpg',
    summary: 'The largest of all Ahom monuments, known for its underground stories and secret tunnels used for military maneuvers.',
    year: 1751,
    content: [],
    infobox: []
  }
];

// Database Connection Setup
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sibsagar_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper: Execute Query or Return Fallback
async function safeQuery(query, params = []) {
    try {
        const [rows] = await pool.query(query, params);
        return { success: true, data: rows };
    } catch (err) {
        console.warn("⚠️ Database Error (Serving Fallback):", err.message);
        return { success: false, error: err.message };
    }
}

// Helper: Seed Database if Empty
async function seedDatabase(connection) {
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM artifacts');
        if (rows[0].count === 0) {
            console.log("🌱 Seeding database with initial data...");
            for (const item of INITIAL_DATA) {
                await connection.query(
                    `INSERT INTO artifacts (id, title, category, year, summary, main_image_url) VALUES (?, ?, ?, ?, ?, ?)`,
                    [item.id, item.title, item.category, item.year, item.summary, item.image]
                );
            }
            console.log("✅ Database seeded successfully!");
        }
    } catch (err) {
        console.warn("⚠️ Seeding skipped:", err.message);
    }
}

// ==========================================
// ARTIFACT ENDPOINTS
// ==========================================

// GET All Artifacts
app.get('/api/artifacts', async (req, res) => {
    const result = await safeQuery('SELECT * FROM artifacts ORDER BY lineage_order ASC, year ASC');
    
    if (result.success) {
        res.json(result.data);
    } else {
        // Fallback to Mock Data if DB fails
        res.json(INITIAL_DATA);
    }
});

// GET Single Artifact
app.get('/api/artifacts/:id', async (req, res) => {
    const { id } = req.params;
    const result = await safeQuery('SELECT * FROM artifacts WHERE id = ?', [id]);
    
    if (result.success && result.data.length > 0) {
        const artifact = result.data[0];
        const sections = await safeQuery('SELECT * FROM artifact_sections WHERE artifact_id = ? ORDER BY section_order ASC', [id]);
        const infobox = await safeQuery('SELECT * FROM artifact_infobox WHERE artifact_id = ? ORDER BY row_order ASC', [id]);
        
        res.json({ 
            ...artifact, 
            content: sections.success ? sections.data : [], 
            infobox: infobox.success ? infobox.data : [] 
        });
    } else {
        // Try finding in Mock Data
        const mock = INITIAL_DATA.find(i => i.id === id);
        if (mock) return res.json(mock);
        
        res.status(404).json({ message: 'Artifact not found' });
    }
});

// POST Artifact (Only works if DB is active)
app.post('/api/artifacts', async (req, res) => {
    const conn = await pool.getConnection().catch(() => null);
    
    if (!conn) {
        return res.status(503).json({ error: "Database unavailable. Cannot save changes." });
    }

    try {
        await conn.beginTransaction();
        const { id, title, category, year, summary, image, content, infobox } = req.body;
        
        await conn.query(
            `INSERT INTO artifacts (id, title, category, year, summary, main_image_url) 
             VALUES (?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE title=?, category=?, year=?, summary=?, main_image_url=?`,
            [id, title, category, year, summary, image, title, category, year, summary, image]
        );

        await conn.query('DELETE FROM artifact_sections WHERE artifact_id = ?', [id]);
        if (content && content.length > 0) {
            const sectionValues = content.map((s, idx) => [id, s.header, s.text, s.image, s.caption, idx]);
            await conn.query('INSERT INTO artifact_sections (artifact_id, header, content, image_url, caption, section_order) VALUES ?', [sectionValues]);
        }

        await conn.query('DELETE FROM artifact_infobox WHERE artifact_id = ?', [id]);
        if (infobox && infobox.length > 0) {
            const infoValues = infobox.map((i, idx) => [id, i.label, i.value, idx]);
            await conn.query('INSERT INTO artifact_infobox (artifact_id, label, value, row_order) VALUES ?', [infoValues]);
        }

        await conn.commit();
        res.json({ message: 'Artifact saved successfully', id });
    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// ==========================================
// RESOURCES ENDPOINTS
// ==========================================

// Upload PDF
const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    })
});

app.post('/api/resources/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, author, type } = req.body;
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        
        const result = await safeQuery(
            'INSERT INTO resources (title, author, type, file_path) VALUES (?, ?, ?, ?)', 
            [title, author, type, filePath]
        );
        
        if (result.success) {
            res.json({ message: 'Resource uploaded', file: filePath });
        } else {
             // Mock success response if DB fails (File is uploaded to disk anyway)
            res.json({ message: 'Resource uploaded (DB Metadata skipped)', file: filePath });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Resources
app.get('/api/resources', async (req, res) => {
    const result = await safeQuery('SELECT * FROM resources ORDER BY uploaded_at DESC');
    if (result.success) res.json(result.data);
    else res.json([]); // Return empty array on failure
});

// ==========================================
// START SERVER WITH PORT RETRY
// ==========================================
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        
        // Initial Connection Check & Seeding
        pool.getConnection()
            .then(async conn => {
                console.log("✅ Database Connected Successfully!");
                await seedDatabase(conn); // Auto-seed if empty
                conn.release();
            })
            .catch(err => {
                console.log("⚠️ Database Connection FAILED:", err.message);
                console.log("⚠️ Server is running in FALLBACK MODE (Mock Data)");
                console.log("👉 Check your .env file credentials to enable full database features.");
            });
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error("Server error:", err);
        }
    });
};

startServer(PORT);