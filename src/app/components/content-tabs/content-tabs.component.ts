import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { WishlistService } from '../../services/wishlist.service';
import { Movie, TVShow } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-content-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.scss']
})
export class ContentTabsComponent {
  private movieService = inject(MovieService);
  private languageService = inject(LanguageService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);

  activeTab = signal<'movies' | 'tv'>('movies');
  movies = signal<Movie[]>([]);
  tvShows = signal<TVShow[]>([]);
  
  moviesPage = signal(1);
  moviesTotalPages = signal(1);
  tvPage = signal(1);
  tvTotalPages = signal(1);
  
  moviesLoading = signal(true);
  moviesError = signal('');
  tvLoading = signal(true);
  tvError = signal('');

  canGoPreviousMovies = computed(() => this.moviesPage() > 1);
  canGoNextMovies = computed(() => this.moviesPage() < this.moviesTotalPages());
  canGoPreviousTV = computed(() => this.tvPage() > 1);
  canGoNextTV = computed(() => this.tvPage() < this.tvTotalPages());

  constructor() {
    this.loadMovies();
    this.loadTVShows();

    effect(() => {
   this.languageService.getCurrentLanguage();
});
  }

  setActiveTab(tab: 'movies' | 'tv') {
    this.activeTab.set(tab);
  }

  navigateToSearch(query: string) {
    console.log('Navigate to search called with query:', query);
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    } else {
      this.router.navigate(['/search']);
    }
  }

  async loadMovies() {
    try {
      this.moviesLoading.set(true);
      this.moviesError.set('');
      const response = await this.movieService.getMovies(this.moviesPage());
      this.movies.set(response.results);
      this.moviesTotalPages.set(response.total_pages);
    } catch {
      this.moviesError.set('Failed to load movies');
    } finally {
      this.moviesLoading.set(false);
    }
  }

  async goToMoviesPage(page: number) {
  console.log('Going to page:', page, 'Total pages:', this.moviesTotalPages());
  if (page < 1 || page > this.moviesTotalPages()) return;
  this.moviesPage.set(page);
  await this.loadMovies();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  nextMoviesPage() { this.goToMoviesPage(this.moviesPage() + 1); }
  previousMoviesPage() { this.goToMoviesPage(this.moviesPage() - 1); }

  async loadTVShows() {
    try {
      this.tvLoading.set(true);
      this.tvError.set('');
      const response = await this.movieService.getTVShows(this.tvPage());
      this.tvShows.set(response.results);
      this.tvTotalPages.set(response.total_pages);
    } catch {
      this.tvError.set('Failed to load TV shows');
    } finally {
      this.tvLoading.set(false);
    }
  }

  async goToTVPage(page: number) {
    if (page < 1 || page > this.tvTotalPages()) return;
    this.tvPage.set(page);
    await this.loadTVShows();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextTVPage() { this.goToTVPage(this.tvPage() + 1); }
  previousTVPage() { this.goToTVPage(this.tvPage() - 1); }

  goToMovieDetails(movieId: number) { this.router.navigate(['/movie', movieId]); }
  goToTVDetails(tvId: number) { this.router.navigate(['/tv', tvId]); }

  toggleMovieWishlist(event: Event, movie: Movie) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist({...movie, type: 'movie'});
  }

  toggleTVWishlist(event: Event, tvShow: TVShow) {
    event.stopPropagation();
    const wishlistItem = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      vote_average: tvShow.vote_average,
      release_date: tvShow.first_air_date,
      type: 'tv' as const
    };
    this.wishlistService.toggleWishlist(wishlistItem);
  }

  getVisiblePages(): number[] {
  const current = this.moviesPage();
  const total = this.moviesTotalPages();
  console.log('Current page:', current, 'Total pages:', total);
  const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, Math.min(current - 2, total - 4));
      const end = Math.min(total, start + 4);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  isInWishlist(id: number): boolean { 
    return this.wishlistService.isInWishlist()(id); 
  }
  
  getImageUrl(path: string | null): string { 
    return this.movieService.getImageUrl(path); 
  }
}