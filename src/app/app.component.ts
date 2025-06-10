import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Movie Reviews';

  constructor(private router: Router, public auth: AuthService) {}

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { search: query }
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
