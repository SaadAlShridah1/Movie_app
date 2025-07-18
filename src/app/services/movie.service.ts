import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Movie, MovieDetails, MovieResponse, Recommendation, Review, ReviewsResponse, TVShow, TVShowDetails, TVShowResponse } from '../interfaces/movie.interface';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
    private languageService = inject(LanguageService);
  private apiKey = '5d5adcf0c34d191699b009292dd97ef3'; 
  private baseUrl = 'https://api.themoviedb.org/3';

  async getMovies(page: number = 1): Promise<MovieResponse> {
        const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}&language=${language}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    return await response.json();
  }
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=${language}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    return await response.json();
  }
    async getMovieDetails(movieId: number): Promise<MovieDetails> {
      const language = this.languageService.getCurrentLanguage().code;
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=${language}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      return await response.json();
  }

  async getMovieRecommendations(movieId: number): Promise<Movie[]> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}&language=${language}`;
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
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/movie/${movieId}/reviews?api_key=${this.apiKey}&language=${language}`;
      console.log('Reviews URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
          console.error('Reviews API error:', response.status, response.statusText);
      throw new Error('Failed to fetch movie reviews');
    }
    
    const data: ReviewsResponse = await response.json();
    return data.results;
  }
  async getTVShows(page: number = 1): Promise<TVShowResponse> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&page=${page}&language=${language}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows');
    }
    
    return await response.json();
  }
  async getTVShowDetails(tvId: number): Promise<TVShowDetails> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/tv/${tvId}?api_key=${this.apiKey}&language=${language}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch TV show details');
    }
    return await response.json();
  }
  async getTVShowRecommendations(tvId: number): Promise<TVShow[]> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/tv/${tvId}/recommendations?api_key=${this.apiKey}&language=${language}`;
    console.log('TV Recommendations URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('TV Recommendations API error:', response.status, response.statusText);
      throw new Error('Failed to fetch TV show recommendations');
    }
    
    const data = await response.json();
    console.log('TV Recommendations data:', data);
    return data.results;
  }

  async getTVShowReviews(tvId: number): Promise<Review[]> {
    const language = this.languageService.getCurrentLanguage().code;
    const url = `${this.baseUrl}/tv/${tvId}/reviews?api_key=${this.apiKey}&language=${language}`;
    console.log('TV Reviews URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('TV Reviews API error:', response.status, response.statusText);
      throw new Error('Failed to fetch TV show reviews');
    }
    
    const data: ReviewsResponse = await response.json();
    return data.results;
  }
  
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w1280');
  }
}