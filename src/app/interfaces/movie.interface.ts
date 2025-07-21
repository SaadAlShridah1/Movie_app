import e from "express";

export interface Movie {
  id: number;  
  title: string;
poster_path: string;
backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  original_language: string;
}
export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
homepage: any;
production_companies: any;
spoken_languages: any;
  runtime: number;
  genres: Genre[];
  status: string;
  tagline: string;
}
export interface MovieResponse {
page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export interface Recommendation {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
  url: string;
}

export interface ReviewsResponse {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

export interface WishlistItem {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  addedAt: Date;
  type?: 'movie' | 'tv';
  }

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids?: number[];
  original_language: string;
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  status: string;
  tagline: string;
  last_air_date: string;
  episode_run_time: number[];
  created_by: Creator[];
}
export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}