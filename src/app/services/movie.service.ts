import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.tmdbApiKey}`,
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', 'en-US');

    return this.http.get(`${this.apiUrl}/movie/popular`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          console.error('❌ Error fetching popular movies:', error);
          throw error;
        })
      );
  }

  getMovieDetails(id: string): Observable<any> {
    const params = new HttpParams()
      .set('append_to_response', 'videos,credits')
      .set('language', 'en-US');

    return this.http.get(`${this.apiUrl}/movie/${id}`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          console.error('❌ Error fetching movie details:', error);
          throw error;
        })
      );
  }

  searchMovies(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('language', 'en-US');

    return this.http.get(`${this.apiUrl}/search/movie`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          console.error('❌ Error searching movies:', error);
          throw error;
        })
      );
  }

  getMovieReviews(id: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', 'en-US');

    return this.http.get(`${this.apiUrl}/movie/${id}/reviews`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          console.error('❌ Error fetching movie reviews:', error);
          throw error;
        })
      );
  }

  getMoviesByGenre(genreId: number): Observable<any> {
    const params = new HttpParams()
      .set('with_genres', genreId.toString())
      .set('language', 'en-US');

    return this.http.get(`${this.apiUrl}/discover/movie`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          console.error('❌ Error fetching movies by genre:', error);
          throw error;
        })
      );
  }
  filterMovies(params: any): Observable<any> {
  const httpParams = new HttpParams({ fromObject: params });

  return this.http.get(`${this.apiUrl}/discover/movie`, {
    headers: this.headers,
    params: httpParams
  }).pipe(
    catchError(error => {
      console.error('❌ Error filtering movies:', error);
      throw error;
    })
  );
}

}
