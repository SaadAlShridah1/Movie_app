import { Component, inject, signal,computed, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService} from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { LanguageService } from '../../services/language.service';




@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent {
  movieService = inject(MovieService); 
  languageService = inject(LanguageService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  currentPage = signal(1);
  totalPages = signal(1);
  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal('');

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  moviesWithRating = computed(() => {
    return this.movies().map(movie => ({
      ...movie,
      ratingClass: this.getRatingClass(movie.vote_average),
      formattedRating: (movie.vote_average * 10).toFixed(0),
      isInWishlist: this.wishlistService.isInWishlist()(movie.id),
      imageUrl: this.getImageUrl(movie.poster_path)
    }));
  });

  private getRatingClass(rating: number): string {
    if (rating >= 7) return 'good';
    if (rating >= 5) return 'average';
    return 'poor';
  }

  constructor() {
    this.loadMovies(); 
    effect(() => {
      this.languageService.getCurrentLanguage();
      this.currentPage.set(1);
      this.loadMovies();
    });
  }
  async loadMovies() {
    try {
      this.loading.set(true);
      this.error.set('');
      const response = await this.movieService.getMovies(this.currentPage());
      this.movies.set(response.results);
      this.totalPages.set(response.total_pages);
      this.loading.set(false);

    } catch {
      this.error.set('Failed to load movies');
      this.loading.set(false);
    }
  }
  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
    await this.loadMovies();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async nextPage() {
    if (this.canGoNext()) {
      await this.goToPage(this.currentPage() + 1);
    }
  }
  async previousPage() {
    if (this.canGoPrevious()) {
      await this.goToPage(this.currentPage() - 1);
    }
  }
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }
  toggleWishlist(event: Event, movie: Movie) {
    event.stopPropagation(); 
    this.wishlistService.toggleWishlist({ ...movie, type: 'movie' });
  }
  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path);
  }
}