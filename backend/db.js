import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'maiz.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize schema once on startup
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    subtitle TEXT,
    description TEXT,
    base_servings INTEGER NOT NULL,
    prep_time INTEGER,
    cook_time INTEGER,
    temp TEXT,
    difficulty TEXT,
    color TEXT,
    cover_image TEXT
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id TEXT NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subrecipes (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    yield TEXT,
    color TEXT,
    process TEXT
  );

  CREATE TABLE IF NOT EXISTS subrecipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sub_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount TEXT NOT NULL,
    FOREIGN KEY(sub_id) REFERENCES subrecipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_cost REAL NOT NULL,
    supplier TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    recipe_id TEXT,
    price REAL,
    notes TEXT,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id TEXT,
    product_id TEXT,
    batch_size INTEGER,
    labor_cost REAL,
    packaging_cost REAL,
    overhead REAL,
    notes TEXT,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE SET NULL,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
  );
`);

const ensureColumn = (table, column, alterSql) => {
  const rows = db.prepare(`PRAGMA table_info(${table});`).all();
  const exists = rows.some(r => r.name === column);
  if (!exists) {
    db.exec(alterSql);
  }
};

ensureColumn('recipes', 'cover_image', 'ALTER TABLE recipes ADD COLUMN cover_image TEXT;');

export default db;
