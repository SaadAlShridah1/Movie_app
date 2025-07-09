import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  movieService = inject(MovieService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(false);
  error = signal('');
  hasSearched = signal(false);

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  async searchMovies() {
    const query = this.searchQuery().trim();
    if (!query) return;

    try {
      this.loading.set(true);
      this.error.set('');
      this.hasSearched.set(true);
      
      const response = await this.movieService.searchMovies(query, this.currentPage());
      
      this.searchResults.set(response.results);
      this.totalPages.set(response.total_pages);
      this.loading.set(false);
    } catch {
      this.error.set('Failed to search movies');
      this.loading.set(false);
    }
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    
    this.currentPage.set(page);
    await this.searchMovies();
    
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

  onSearchInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.hasSearched.set(false);
    this.currentPage.set(1);
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  toggleWishlist(event: Event, movie: Movie) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist()(movieId);
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path);
  }
}