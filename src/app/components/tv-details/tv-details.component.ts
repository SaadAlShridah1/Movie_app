import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { TVShowDetails, TVShow } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-tv-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-details.component.html',
  styleUrl: './tv-details.component.scss'
})
export class TVDetailsComponent {
  private movieService = inject(MovieService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tvShow = signal<TVShowDetails | null>(null);
  recommendations = signal<TVShow[]>([]);
  tvId = 0;
  loading = signal(true);
  error = signal('');
  recommendationsLoading = signal(false);
  recommendationsError = signal('');

  constructor() {
    this.loadTVDetails();
  }

  async loadTVDetails() {
    try {
      this.tvId = Number(this.route.snapshot.paramMap.get('id'));
      this.tvShow.set(await this.movieService.getTVShowDetails(this.tvId));
      this.loadRecommendations();
    } catch {
      this.error.set('Failed to load TV show details');
    } finally {
      this.loading.set(false);
    }
  }

  async loadRecommendations() {
    try {
      this.recommendationsLoading.set(true);
      this.recommendations.set(await this.movieService.getTVShowRecommendations(this.tvId));
    } catch {
      this.recommendationsError.set('Failed to load recommendations');
    } finally {
      this.recommendationsLoading.set(false);
    }
  }

  onRecommendationSelected(tvId: number) {
    this.router.navigate(['/tv', tvId]);
    this.tvShow.set(null);
    this.recommendations.set([]);
    this.loading.set(true);
    this.loadTVDetails();
  }

  toggleWishlist(tvShow: TVShowDetails) {
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

  goBack() { this.router.navigate(['/']); }
  isInWishlist(tvId: number): boolean { return this.wishlistService.isInWishlist()(tvId); }
  getImageUrl(path: string): string { return this.movieService.getImageUrl(path); }
  getBackdropUrl(path: string): string { return this.movieService.getBackdropUrl(path); }
  
  formatRuntime(episodeRuntime: number[]): string {
    if (!episodeRuntime?.length) return 'N/A';
    const avg = Math.round(episodeRuntime.reduce((a, b) => a + b, 0) / episodeRuntime.length);
    return `${avg} min/episode`;
  }
  
  formatCreators(creators: any[]): string {
    return creators?.length ? creators.map(c => c.name).join(', ') : 'N/A';
  }
}