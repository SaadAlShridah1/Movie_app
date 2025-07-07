import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetails, Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
private movieService = inject(MovieService);
private route = inject(ActivatedRoute);
private router = inject(Router);

movie: MovieDetails | null = null;
recommendations:Movie[] = [];
loading = true;
error = ''

constructor() {
  this.loadMovieDetails();
}
async loadMovieDetails() {
  try {
    const movieId = Number(this.route.snapshot.paramMap.get('id'))
    console.log('Loading movie details for ID:', movieId);
    this.movie = await this.movieService.getMovieDetails(movieId);
    console.log('Movie data loaded:', this.movie);
    this.recommendations = await this.movieService.getMovieRecommendations(movieId);
    console.log('Recommendations loaded:', this.recommendations);

    this.movie = await this.movieService.getMovieDetails(movieId);
    console.log('Movie data loaded:', this.movie);
      this.loading = false;
  }
  catch{
    console.error('Error loading movie:', this.error);
    this.error = 'Failed to load movie details';
    this.loading = false;
  }       
}
goBack() {
  this.router.navigate(['/']);
}

goToMovieDetails(movieId: number) {
  this.router.navigate(['/movie', movieId]);
  this.movie = null;
  this.recommendations = [];
  this.loading = true;
  this.loadMovieDetails();
}

getImageUrl(path: string): string {
  return this.movieService.getImageUrl(path);
}
getBackdropUrl(path: string): string {
  return this.movieService.getBackdropUrl(path);
}
}