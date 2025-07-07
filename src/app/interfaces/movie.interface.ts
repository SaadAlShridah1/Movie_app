export interface Movie {
  id: number;  
  title: string;
poster_path: string;
backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  popularity?: number;
}
export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
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