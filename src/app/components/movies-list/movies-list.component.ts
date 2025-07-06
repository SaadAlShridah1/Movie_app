import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent {
  movieService = inject(MovieService); 
  movies: Movie[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadMovies(); 
  }

  async loadMovies() {
    try {
      this.movies = await this.movieService.getMovies();
      this.loading = false;
    } catch {
      this.error = 'Failed to load movies';
      this.loading = false;
    }
  }
}