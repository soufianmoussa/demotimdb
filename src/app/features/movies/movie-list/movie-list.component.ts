import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  standalone: false
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;
  searchQuery: string = '';

  selectedGenre: number | null = null;
  selectedYear: string = '';
  sortBy: string = 'popularity.desc';
  years: string[] = [];

  genres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' }
  ];

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Generate the last 20 years
    this.years = Array.from({ length: 20 }, (_, i) => `${new Date().getFullYear() - i}`);

    this.route.queryParams.subscribe(params => {
      console.log('Query params received:', params);
      const searchQuery = params['search'];
      this.searchQuery = searchQuery || '';
      console.log('Search query:', searchQuery);
      if (searchQuery) {
        console.log('Calling searchMovies with:', searchQuery);
        this.searchMovies(searchQuery);
      } else {
        console.log('No search query, calling applyFilters');
        this.applyFilters(); // default popular movies
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      language: 'en-US',
      page: this.currentPage,
      sort_by: this.sortBy,
    };

    if (this.selectedGenre) {
      params.with_genres = this.selectedGenre;
    }

    if (this.selectedYear) {
      params.primary_release_year = this.selectedYear;
    }

    this.movieService.filterMovies(params).subscribe({
      next: (response) => {
        this.movies = response.results.map((movie: any) => ({
          ...movie,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'assets/images/movie-placeholder.jpg'
        }));
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error applying filters:', err);
        this.error = 'Failed to apply filters.';
        this.loading = false;
      }
    });
  }

  searchMovies(query: string): void {
    console.log('searchMovies called with query:', query);
    this.loading = true;
    this.error = null;

    this.movieService.searchMovies(query, this.currentPage).subscribe({
      next: (response) => {
        console.log('Search response received:', response);
        this.movies = response.results.map((movie: any) => ({
          ...movie,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'assets/images/movie-placeholder.jpg'
        }));
        this.totalPages = response.total_pages;
        this.loading = false;
        console.log('Search completed, movies count:', this.movies.length);
      },
      error: (err) => {
        console.error('Error searching movies:', err);
        this.error = 'Failed to search movies.';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.router.navigate(['/movies']);
  }

  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }
}
