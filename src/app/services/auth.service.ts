import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.backendUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{success: boolean; username?: string}>(`${this.api}/login`, { username, password }).pipe(
      tap(res => {
        if (res.success && res.username) {
          localStorage.setItem('currentUser', res.username);
        }
      })
    );
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
}
