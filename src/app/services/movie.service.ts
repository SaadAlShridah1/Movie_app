import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieResponse {
  results: Movie[];
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = '5d5adcf0c34d191699b009292dd97ef3'; 
  private baseUrl = 'https://api.themoviedb.org/3';

  async getMovies(): Promise<Movie[]> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    const data: MovieResponse = await response.json();
    return data.results;
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}