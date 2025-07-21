import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { WishlistService } from '../../services/wishlist.service';
import { TVShow } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-tv-shows-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-shows-page.component.html',
  styleUrls: ['./tv-shows-page.component.scss']
})
export class TVShowsPageComponent implements OnInit {
  private movieService = inject(MovieService);
  private languageService = inject(LanguageService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);

  tvShows = signal<TVShow[]>([]);
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
      this.loadTVShows();
    });
  }
  ngOnInit() {
    this.loadTVShows();
  }

  async loadTVShows() {
    try {
      this.loading.set(true);
      this.error.set('');
      const response = await this.movieService.getTVShows(this.currentPage());
      this.tvShows.set(response.results);
      this.totalPages.set(response.total_pages);
    } catch {
      this.error.set('Failed to load TV shows');
    } finally {
      this.loading.set(false);
    }
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    await this.loadTVShows();
  }

  nextPage() { this.goToPage(this.currentPage() + 1); }
  previousPage() { this.goToPage(this.currentPage() - 1); }

  goToTVDetails(tvId: number) { this.router.navigate(['/tv', tvId]); }

  toggleWishlist(event: Event, tvShow: TVShow) {
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

  isInWishlist(tvId: number): boolean { return this.wishlistService.isInWishlist()(tvId); }
  getImageUrl(path: string | null): string { return this.movieService.getImageUrl(path); }
}