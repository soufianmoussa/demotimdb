import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MovieService } from './services/movie.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'Movie Reviews';
  suggestions: any[] = [];
  showSuggestions = false;
  private searchDebouncer = new Subject<string>();

  constructor(
    private router: Router,
    public auth: AuthService,
    private movieService: MovieService
  ) {
    // Écoute les frappes avec un délai de 300ms
    this.searchDebouncer.pipe(debounceTime(300)).subscribe((query) => {
      const trimmed = query.trim();
      if (trimmed.length >= 2) {
        this.movieService.searchMovies(trimmed).subscribe({
          next: (res) => {
            this.suggestions = res.results.slice(0, 6); // top 6 suggestions
            this.showSuggestions = true;
          },
          error: () => {
            this.suggestions = [];
            this.showSuggestions = false;
          },
        });
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  onInput(query: string): void {
    this.searchDebouncer.next(query);
  }

  onSearch(query: string): void {
    const trimmedQuery = query?.trim();
    if (trimmedQuery) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/movies'], {
          queryParams: { search: trimmedQuery },
        });
      });
      this.suggestions = [];
      this.showSuggestions = false;
    } else {
      this.router.navigate(['/movies']);
    }
  }

  goToMovie(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
    this.suggestions = [];
    this.showSuggestions = false;
  }

  hideSuggestionsDelayed(): void {
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
