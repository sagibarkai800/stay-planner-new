const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Open database
const db = new Database(path.join(dataDir, 'app.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Trips table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      country TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized successfully');
}

// User helper functions
function createUser(email, passwordHash) {
  try {
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const result = stmt.run(email, passwordHash);
    return { success: true, userId: result.lastInsertRowid };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Email already exists' };
    }
    return { success: false, error: error.message };
  }
}

function findUserByEmail(email) {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

function findUserById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

// Trip helper functions
function createTrip(userId, country, startDate, endDate) {
  try {
    const stmt = db.prepare(`
      INSERT INTO trips (user_id, country, start_date, end_date) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(userId, country, startDate, endDate);
    return { success: true, tripId: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function listTripsByUser(userId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM trips 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  } catch (error) {
    console.error('Error listing trips:', error);
    return [];
  }
}

function deleteTrip(tripId, userId) {
  try {
    const stmt = db.prepare('DELETE FROM trips WHERE id = ? AND user_id = ?');
    const result = stmt.run(tripId, userId);
    return { success: result.changes > 0, changes: result.changes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function updateTrip(tripId, userId, updates) {
  try {
    const allowedFields = ['country', 'start_date', 'end_date'];
    const validUpdates = {};
    
    // Only allow updates to allowed fields
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        validUpdates[key] = value;
      }
    }
    
    if (Object.keys(validUpdates).length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }
    
    const setClause = Object.keys(validUpdates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(validUpdates), tripId, userId];
    
    const stmt = db.prepare(`
      UPDATE trips 
      SET ${setClause} 
      WHERE id = ? AND user_id = ?
    `);
    
    const result = stmt.run(...values);
    return { success: result.changes > 0, changes: result.changes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getTripById(tripId, userId) {
  try {
    const stmt = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?');
    return stmt.get(tripId, userId);
  } catch (error) {
    console.error('Error getting trip:', error);
    return null;
  }
}

// Document helper functions
function createDocument(userId, filename, filePath) {
  try {
    const stmt = db.prepare('INSERT INTO docs (user_id, filename, path) VALUES (?, ?, ?)');
    const result = stmt.run(userId, filename, filePath);
    return { success: true, docId: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function listDocumentsByUser(userId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM docs 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  } catch (error) {
    console.error('Error listing documents:', error);
    return [];
  }
}

function deleteDocument(docId, userId) {
  try {
    const stmt = db.prepare('DELETE FROM docs WHERE id = ? AND user_id = ?');
    const result = stmt.run(docId, userId);
    return { success: result.changes > 0, changes: result.changes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Initialize database on module load
initializeDatabase();

module.exports = {
  db,
  // User functions
  createUser,
  findUserByEmail,
  findUserById,
  // Trip functions
  createTrip,
  listTripsByUser,
  deleteTrip,
  updateTrip,
  getTripById,
  // Document functions
  createDocument,
  listDocumentsByUser,
  deleteDocument,
  // Utility
  initializeDatabase
};
