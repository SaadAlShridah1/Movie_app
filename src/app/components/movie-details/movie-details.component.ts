import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { MovieDetails, Movie } from '../../interfaces/movie.interface';
import { MovieRecommendationsComponent } from '../movie-recommendations/movie-recommendations.component';
import { MovieReviewsComponent } from "../movie-reviews/movie-reviews.component";


@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, MovieRecommendationsComponent, MovieReviewsComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
private movieService = inject(MovieService);
private wishlistService = inject(WishlistService);
private route = inject(ActivatedRoute);
private router = inject(Router);

movie: MovieDetails | null = null;
recommendations:Movie[] = [];
movieId: number = 0;
loading = true;
error = ''

constructor() {
  this.loadMovieDetails();
}
async loadMovieDetails() {
  try {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'))
    console.log('Loading movie details for ID:', this.movieId);
    this.movie = await this.movieService.getMovieDetails(this.movieId);
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
 onRecommendationSelected(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    this.movie = null;
    this.loading = true;
    this.loadMovieDetails();
  }

goToMovieDetails(movieId: number) {
  this.router.navigate(['/movie', movieId]);
  this.movie = null;
  this.recommendations = [];
  this.loading = true;
  this.loadMovieDetails();
}
toggleWishlist(movie: MovieDetails) {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist()(movieId);
  }

getImageUrl(path: string): string {
  return this.movieService.getImageUrl(path);
}
getBackdropUrl(path: string): string {
  return this.movieService.getBackdropUrl(path);
}
}