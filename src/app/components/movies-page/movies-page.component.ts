import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { WishlistService } from '../../services/wishlist.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movies-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.scss']
})
export class MoviesPageComponent implements OnInit {
  private movieService = inject(MovieService);
  private languageService = inject(LanguageService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);

  movies = signal<Movie[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(true);
  error = signal('');

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    effect(() => {
      this.languageService.getCurrentLanguage();
      this.currentPage.set(1);
      this.loadMovies();
    });
  }

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies() {
    try {
      this.loading.set(true);
      this.error.set('');
      const response = await this.movieService.getMovies(this.currentPage());
      this.movies.set(response.results);
      this.totalPages.set(response.total_pages);
    } catch {
      this.error.set('Failed to load movies');
    } finally {
      this.loading.set(false);
    }
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    await this.loadMovies();
  }

  nextPage() { this.goToPage(this.currentPage() + 1); }
  previousPage() { this.goToPage(this.currentPage() - 1); }

  goToMovieDetails(movieId: number) { this.router.navigate(['/movie', movieId]); }

  toggleWishlist(event: Event, movie: Movie) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist({...movie, type: 'movie'});
  }

  isInWishlist(movieId: number): boolean { return this.wishlistService.isInWishlist()(movieId); }
  getImageUrl(path: string | null): string { return this.movieService.getImageUrl(path); }
}