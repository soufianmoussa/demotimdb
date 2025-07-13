import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.backendUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    // Hardcoded test user
    const testUser = { username: 'testuser', password: '123456' };
    return new Observable<{ success: boolean; username?: string }>(observer => {
      if (username === testUser.username && password === testUser.password) {
        localStorage.setItem('currentUser', testUser.username);
        observer.next({ success: true, username: testUser.username });
        observer.complete();
      } else {
        observer.error({ success: false });
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  // Watchlist methods
  getWatchlist(): any[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    const data = localStorage.getItem(`watchlist_${user}`);
    return data ? JSON.parse(data) : [];
  }

  addToWatchlist(movie: any): void {
    const user = this.getCurrentUser();
    if (!user) return;
    const list = this.getWatchlist();
    if (!list.find((m: any) => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem(`watchlist_${user}`, JSON.stringify(list));
    }
  }

  removeFromWatchlist(movieId: number): void {
    const user = this.getCurrentUser();
    if (!user) return;
    let list = this.getWatchlist();
    list = list.filter((m: any) => m.id !== movieId);
    localStorage.setItem(`watchlist_${user}`, JSON.stringify(list));
  }
}
