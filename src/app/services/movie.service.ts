import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Movie, MovieDetails, MovieResponse, Recommendation, Review, ReviewsResponse  } from '../interfaces/movie.interface';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = '5d5adcf0c34d191699b009292dd97ef3'; 
  private baseUrl = 'https://api.themoviedb.org/3';

  async getMovies(page: number = 1): Promise<MovieResponse> {
    const url = `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    return await response.json();
  }
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    return await response.json();
  }
    async getMovieDetails(movieId: number): Promise<MovieDetails> {
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      return await response.json();
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w1280');
  }
  async getMovieRecommendations(movieId: number): Promise<Movie[]> {
    const url = `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}`;
    console.log('Recommendations URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
          console.error('Recommendations API error:', response.status, response.statusText);
      throw new Error('Failed to fetch movie recommendations');
    }
    
    const data: Recommendation = await response.json();
    console.log('Recommendations data:', data);
    return data.results;
  }
  async getMovieReviews(movieId: number): Promise<Review[]> {
    const url = `${this.baseUrl}/movie/${movieId}/reviews?api_key=${this.apiKey}`;
      console.log('Reviews URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
          console.error('Reviews API error:', response.status, response.statusText);
      throw new Error('Failed to fetch movie reviews');
    }
    
    const data: ReviewsResponse = await response.json();
    return data.results;
  }
}