import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class ForumStorageService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(Capacitor.isNativePlatform() ? window : null);
  }

  async init() {
this.db = await this.sqlite.createConnection('forumdb', false, 'no-encryption', 1, false);
    await this.db.open();
    await this.createTable();
  }

  private async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        author TEXT,
        date TEXT,
        likes INTEGER,
        replies INTEGER
      );
    `;
    await this.db?.execute(query);
  }

  async addPost(post: any) {
    const sql = `
      INSERT INTO posts (title, content, author, date, likes, replies)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [post.title, post.content, post.author, post.date.toISOString(), post.likes, post.replies];
    await this.db?.run(sql, values);
  }

  async getPosts(): Promise<any[]> {
    const result = await this.db?.query('SELECT * FROM posts ORDER BY date DESC');
    return result?.values ?? [];
  }

  async likePost(id: number) {
    await this.db?.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id]);
  }
}
