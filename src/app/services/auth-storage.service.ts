import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db?: SQLiteDBConnection;

  async init(): Promise<void> {
    this.db = await this.sqlite.createConnection('authdb', false, 'no-encryption', 1, false);
    await this.db.open();
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL
      );
    `);
   await this.db.run(
  `INSERT INTO users (username, password) VALUES (?, ?);`,
  ['testuser', '123456']
);

  await this.db.close();
  }

  async saveUser(username: string): Promise<void> {
    await this.init();
    await this.db?.run('INSERT OR IGNORE INTO users (username) VALUES (?)', [username]);
  }

  async getUser(): Promise<string | null> {
    await this.init();
    const result = await this.db?.query('SELECT username FROM users LIMIT 1');
    if (result && result.values?.length) {
      return result.values[0].username;
    }
    return null;
  }

  async logout(): Promise<void> {
    await this.init();
    await this.db?.execute('DELETE FROM users');
  }
}
