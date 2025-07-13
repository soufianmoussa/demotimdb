import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-bg py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-7">
            <div class="profile-card shadow-lg p-4 mb-4">
              <div class="d-flex align-items-center mb-4 profile-header">
                <div class="profile-avatar me-3">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div>
                  <h2 class="mb-1 profile-username">{{ username }}</h2>
                  <span class="badge bg-warning text-dark">MovieDB User</span>
                </div>
              </div>
              <div *ngIf="username; else notLoggedIn">
                <h4 class="mb-3 mt-4 profile-section-title">
                  <i class="bi bi-heart-fill me-2 text-warning"></i>My Watchlist
                </h4>
                <div *ngIf="watchlist.length > 0; else emptyWatchlist">
                  <div class="row g-3">
                    <div class="col-md-6 col-lg-4" *ngFor="let movie of watchlist">
                      <div class="watchlist-movie-card card h-100">
                        <img [src]="movie.poster_path" alt="{{ movie.title }}" class="card-img-top watchlist-poster" onerror="this.src='assets/images/movie-placeholder.jpg'">
                        <div class="card-body d-flex flex-column">
                          <h6 class="card-title text-truncate mb-2">{{ movie.title }}</h6>
                          <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="badge bg-secondary">{{ movie.release_date | date:'yyyy' }}</span>
                            <button class="btn btn-sm btn-outline-danger" (click)="removeFromWatchlist(movie.id)">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #emptyWatchlist>
                  <div class="alert alert-info mt-3">
                    <i class="bi bi-info-circle me-2"></i>Your watchlist is empty. Start adding movies!
                  </div>
                </ng-template>
              </div>
              <ng-template #notLoggedIn>
                <div class="alert alert-danger mt-4">
                  <i class="bi bi-exclamation-triangle me-2"></i>You are not logged in.
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-bg {
      background: linear-gradient(135deg, #181818 0%, #232323 100%);
      min-height: 100vh;
    }
    .profile-card {
      background: #1f1f1f;
      border-radius: 18px;
      color: var(--imdb-light);
      border: 1px solid var(--imdb-border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    }
    .profile-header {
      border-bottom: 1px solid var(--imdb-border);
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .profile-avatar {
      font-size: 4rem;
      color: var(--imdb-yellow);
      background: #232323;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(245,197,24,0.08);
    }
    .profile-username {
      font-size: 2rem;
      font-weight: 700;
      color: var(--imdb-yellow);
      margin-bottom: 0.2rem;
    }
    .profile-section-title {
      color: var(--imdb-yellow);
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .watchlist-movie-card {
      background: #232323;
      border-radius: 12px;
      border: 1px solid var(--imdb-border);
      box-shadow: 0 2px 10px rgba(0,0,0,0.18);
      transition: transform 0.2s, box-shadow 0.2s;
      color: var(--imdb-light);
    }
    .watchlist-movie-card:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 24px rgba(245,197,24,0.10);
    }
    .watchlist-poster {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      object-fit: cover;
      height: 320px;
      background: #111;
    }
    .btn-outline-danger {
      border-color: #dc3545;
      color: #dc3545;
      transition: all 0.2s;
    }
    .btn-outline-danger:hover {
      background: #dc3545;
      color: #fff;
      border-color: #dc3545;
    }
    .alert-info {
      background: rgba(245,197,24,0.08);
      color: var(--imdb-yellow);
      border-left: 4px solid var(--imdb-yellow);
      border-radius: 8px;
    }
    .alert-danger {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
      border-left: 4px solid #dc3545;
      border-radius: 8px;
    }
  `]
})
export class ProfileComponent {
  username: string | null = null;
  watchlist: any[] = [];

  constructor(private auth: AuthService) {
    this.username = this.auth.getCurrentUser();
    this.loadWatchlist();
  }

  loadWatchlist() {
    if (this.username) {
      this.watchlist = this.auth.getWatchlist();
    }
  }

  removeFromWatchlist(movieId: number) {
    this.auth.removeFromWatchlist(movieId);
    this.loadWatchlist();
  }
} 