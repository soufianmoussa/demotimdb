import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from '../../../services/movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  private sanitizer: DomSanitizer 
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
  },
  error: (err) => {
    console.error('Error fetching movie details:', err);
    this.error = 'Failed to load movie details.';
    this.loading = false;
  }
});

    // Load reviews if available
    this.movieService.getMovieReviews(movieId).subscribe({
      next: (response) => {
        this.comments = response.results.map((review: any) => ({
          id: review.id,
          username: review.author,
          content: review.content,
          rating: review.author_details?.rating || 5,
          date: new Date(review.created_at)
        }));
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        // Don't set error state for reviews, just keep the default empty array
      }
    });
  }

  onSubmitComment() {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        id: this.comments.length + 1,
        username: 'CurrentUser', // TODO: Get from auth service
        content: this.commentForm.value.content,
        rating: this.commentForm.value.rating,
        date: new Date()
      };

      this.comments.unshift(newComment);
      this.commentForm.reset({
        rating: 5
      });
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
