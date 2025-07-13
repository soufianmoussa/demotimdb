import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from '../../../services/movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';

interface Comment {
  id: number;
  username: string;
  content: string;
  rating: number;
  date: Date;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: false
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  comments: Comment[] = [];
  commentForm: FormGroup;
  loading = true;
  trailerUrl: SafeResourceUrl | null = null;
  error: string | null = null;

constructor(
  private route: ActivatedRoute,
  private movieService: MovieService,
  private fb: FormBuilder,
  private sanitizer: DomSanitizer,
  private auth: AuthService
) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (!movieId) {
      this.error = 'Movie ID not found';
      this.loading = false;
      return;
    }

    this.movieService.getMovieDetails(movieId).subscribe({
      next: (response) => {
        this.movie = response;
        this.loading = false;

        // Get trailer from TMDB response
        const trailer = response.videos?.results?.find((v: any) =>
          v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${trailer.key}`
          );
        }
        this.loadComments(movieId);
      },
      error: (err) => {
        console.error('Error fetching movie details:', err);
        this.error = 'Failed to load movie details.';
        this.loading = false;
      }
    });
  }

  loadComments(movieId: string) {
    const data = localStorage.getItem('movie_reviews_' + movieId);
    if (data) {
      this.comments = JSON.parse(data).map((c: any) => ({ ...c, date: new Date(c.date) }));
    } else {
      this.comments = [];
    }
  }

  saveComments(movieId: string) {
    localStorage.setItem('movie_reviews_' + movieId, JSON.stringify(this.comments));
  }

  onSubmitComment() {
    if (this.commentForm.valid) {
      const movieId = this.route.snapshot.paramMap.get('id');
      if (!movieId) return;
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser) {
        this.error = 'Please log in to leave a review.';
        return;
      }
      const newComment: Comment = {
        id: Date.now(),
        username: currentUser,
        content: this.commentForm.value.content,
        rating: this.commentForm.value.rating,
        date: new Date()
      };
      this.comments.unshift(newComment);
      this.saveComments(movieId);
      this.commentForm.reset({ rating: 5 });
      this.error = null;
    }
  }

  setRating(star: number) {
  this.commentForm.patchValue({ rating: star });
}

  getGenresString(): string {
    if (!this.movie?.genres) return '';
    return this.movie.genres.map((genre: any) => genre.name).join(', ');
  }

}
