import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { MovieDetails, Movie } from '../../interfaces/movie.interface';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  private movieService = inject(MovieService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  movie = signal<MovieDetails | null>(null);
  recommendations = signal<Movie[]>([]);
  movieId = 0;
  loading = signal(true);
  error = signal('');

  constructor() {
    effect(() => {
      this.languageService.getCurrentLanguage();
      if(this.movieId) {
        this.movie.set(null);
        this.loading.set(true);
        this.loadMovieDetails();
      }
    });
  }
  ngOnInit() {
    this.loadMovieDetails();
  }

  async loadMovieDetails() {
    try {
      this.movieId = Number(this.route.snapshot.paramMap.get('id'))
      console.log('Loading movie details for ID:', this.movieId);
      this.movie.set(await this.movieService.getMovieDetails(this.movieId));
      this.loadRecommendations();
      console.log('Movie data loaded:', this.movie);
      this.loading.set(false);
    }
    catch{
      console.error('Error loading movie:', this.error);
      this.error.set('Failed to load movie details');
    }
    finally {
      this.loading.set(false);
    }       
  }

  async loadRecommendations() {
    try {
      const recs = await this.movieService.getMovieRecommendations(this.movieId);
      this.recommendations.set(recs.slice(0, 6)); 
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onRecommendationSelected(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    this.movie.set(null);
    this.recommendations.set([]);
    this.loading.set(true);
    this.loadMovieDetails();
  }

  toggleWishlist(movie: MovieDetails) {
    const wishlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      type: 'movie' as const
    };
    this.wishlistService.toggleWishlist(wishlistItem);
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

  getStars(rating: number): { filled: boolean }[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      stars.push({ filled: i < fullStars });
    }
    
    return stars;
  }
}