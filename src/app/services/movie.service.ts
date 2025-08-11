import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Movie, MovieDetails, MovieResponse, Recommendation, Review, ReviewsResponse, TVShow, TVShowDetails, TVShowResponse } from '../interfaces/movie.interface';
import { LanguageService } from './language.service';
import { environment } from './../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);
  private baseUrl = environment.api.tmdb.baseUrl;
  private apiKey = environment.api.tmdb.token; 
  private imageBaseUrl = environment.api.tmdb.imageBaseUrl;

  private currentLanguageCode = computed(() => this.languageService.getCurrentLanguage().code);

  private moviesSignal = signal<Movie[]>([]);
  private tvShowsSignal = signal<TVShow[]>([]);
  private movieDetailsSignal = signal<MovieDetails | null>(null);
  private tvDetailsSignal = signal<TVShowDetails | null>(null);
  private searchResultsSignal = signal<Movie[]>([]);
  private recommendationsSignal = signal<Movie[]>([]);
  private reviewsSignal = signal<Review[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string>('');

  movies = this.moviesSignal.asReadonly();
  tvShows = this.tvShowsSignal.asReadonly();
  movieDetails = this.movieDetailsSignal.asReadonly();
  tvDetails = this.tvDetailsSignal.asReadonly();
  searchResults = this.searchResultsSignal.asReadonly();
  recommendations = this.recommendationsSignal.asReadonly();
  reviews = this.reviewsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async getMovies(page: number = 1): Promise<MovieResponse> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/movie/now_playing`;
      const params = {
        api_key: this.apiKey,
        page: page.toString(),
        language: language
      };
      const response = await firstValueFrom(this.http.get<MovieResponse>(url, { params }));
      this.moviesSignal.set(response.results);
      return response;
      
    } catch (error) {
      const errorMessage = 'Failed to fetch movies';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/search/movie`;
      
      const params = {
        api_key: this.apiKey,
        query: query,
        page: page.toString(),
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<MovieResponse>(url, { params })
      );
      
      this.searchResultsSignal.set(response.results);
      return response;
      
    } catch (error) {
      const errorMessage = 'Failed to search movies';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
    async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/movie/${movieId}`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<MovieDetails>(url, { params })
      );
      
      this.movieDetailsSignal.set(response);
      return response;
      
    } catch (error) {
      const errorMessage = 'Failed to fetch movie details';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
  async getMovieRecommendations(movieId: number): Promise<Movie[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/movie/${movieId}/recommendations`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<Recommendation>(url, { params })
      );
      
      this.recommendationsSignal.set(response.results);
      console.log('Recommendations data:', response);
      return response.results;
      
    } catch (error) {
      console.error('Recommendations API error:', error);
      const errorMessage = 'Failed to fetch movie recommendations';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
  async getMovieReviews(movieId: number): Promise<Review[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/movie/${movieId}/reviews`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<ReviewsResponse>(url, { params })
      );
      
      this.reviewsSignal.set(response.results);
      console.log('Reviews data:', response);
      return response.results;
      
    } catch (error) {
      console.error('Reviews API error:', error);
      const errorMessage = 'Failed to fetch movie reviews';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
  async getTVShows(page: number = 1): Promise<TVShowResponse> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/tv/popular`;
      
      const params = {
        api_key: this.apiKey,
        page: page.toString(),
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<TVShowResponse>(url, { params })
      );
      
      this.tvShowsSignal.set(response.results);
      return response;
      
    } catch (error) {
      const errorMessage = 'Failed to fetch TV shows';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTVShowDetails(tvId: number): Promise<TVShowDetails> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/tv/${tvId}`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<TVShowDetails>(url, { params })
      );
      
      this.tvDetailsSignal.set(response);
      return response;
      
    } catch (error) {
      const errorMessage = 'Failed to fetch TV show details';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTVShowRecommendations(tvId: number): Promise<TVShow[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/tv/${tvId}/recommendations`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<{ results: TVShow[] }>(url, { params })
      );
      
      console.log('TV Recommendations data:', response);
      return response.results;
      
    } catch (error) {
      console.error('TV Recommendations API error:', error);
      const errorMessage = 'Failed to fetch TV show recommendations';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTVShowReviews(tvId: number): Promise<Review[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set('');
      
      const language = this.currentLanguageCode();
      const url = `${this.baseUrl}/tv/${tvId}/reviews`;
      
      const params = {
        api_key: this.apiKey,
        language: language
      };
      
      const response = await firstValueFrom(
        this.http.get<ReviewsResponse>(url, { params })
      );
      
      console.log('TV Reviews data:', response);
      return response.results;
      
    } catch (error) {
      console.error('TV Reviews API error:', error);
      const errorMessage = 'Failed to fetch TV show reviews';
      this.errorSignal.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return 'assets/placeholder.jpg';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w1280');
  }
}