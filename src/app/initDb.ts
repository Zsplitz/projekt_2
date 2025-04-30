import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function init() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT,
      year INTEGER,
      engine TEXT,
      body TEXT
    );
  `);


  console.log('Database initialized');
}

init();
