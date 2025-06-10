import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);
  }

  getMovieById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/movie?query=${query}&api_key=${this.apiKey}`);
  }

  getMoviesByGenre(genreId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`);
}

}
