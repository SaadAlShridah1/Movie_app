import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../interfaces/movie.interface';

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
loading = true;
error = ''

constructor() {
  this.loadMovieDetails();
}
async loadMovieDetails() {
  try {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movie = await this.movieService.getMovieDetails(movieId);
      this.loading = false;
  }
  catch{
    this.error = 'Failed to load movie details';
    this.loading = false;
  }       
}
goBack() {
  this.router.navigate(['/']);
}
getImageUrl(path: string): string {
  return this.movieService.getImageUrl(path);
}
getBackdropUrl(path: string): string {
  return this.movieService.getBackdropUrl(path);
}
}