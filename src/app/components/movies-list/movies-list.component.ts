import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService} from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent {
  movieService = inject(MovieService); 
  private router = inject(Router);
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
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }
  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path);
  }
}