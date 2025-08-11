import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  activeTab = signal<'all' | 'movies' | 'tv'>('all');

  allWishlistItems = computed(() => this.wishlistService.getWishlistItems());
  movieItems = computed(() => this.wishlistService.getMovieItems());
  tvItems = computed(() => this.wishlistService.getTVItems());
  wishlistCount = computed(() => this.wishlistService.wishlistCount());
  movieCount = computed(() => this.wishlistService.movieCount());
  tvCount = computed(() => this.wishlistService.tvCount());
  
  emptyStateText = computed(() => {
    const activeTab = this.activeTab();
    const itemType = activeTab === 'movies' ? 'Movies' : activeTab === 'tv' ? 'TV Shows' : 'items';
    return `No ${itemType} in watch list`;
  });

  itemsWithRating = computed(() => {
    let items;
    switch (this.activeTab()) {
      case 'movies': items = this.movieItems(); break;
      case 'tv': items = this.tvItems(); break;
      default: items = this.allWishlistItems(); break;
    }
    
    return items.map(item => ({
      ...item,
      starsArray: this.getStars(item.vote_average),
      formattedRating: (item.vote_average * 1000).toFixed(0),
      description: this.getMovieDescription(item),
      imageUrl: this.getImageUrl(item.poster_path)
    }));
  });

  private getStars(rating: number): { filled: boolean, cssClass: string, imageSrc: string, altText: string }[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      const filled = i < fullStars;
      stars.push({ 
        filled,
        cssClass: filled ? 'star-filled' : 'star-empty',
        imageSrc: filled ? '/assets/fillStar.png' : '/assets/emptyStar.png',
        altText: filled ? 'Filled star' : 'Empty star'
      });
    }
    
    return stars;
  }

  private getMovieDescription(item: any): string {
    const year = new Date(item.release_date).getFullYear();
    const type = item.type === 'tv' ? 'TV Show' : 'Movie';
    return `${type} • ${year}`;
  }

  
  setActiveTab(tab: 'all' | 'movies' | 'tv') {
    this.activeTab.set(tab);
  }

  removeFromWishlist(itemId: number, type: 'movie' | 'tv') {
    this.wishlistService.removeFromWishlist(itemId, type);
  }

  clearAllWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }
  
  clearMovies() {
    if (confirm('Are you sure you want to clear all movies from your wishlist?')) {
      this.wishlistService.clearMovies();
    }
  }
  
  clearTVShows() {
    if (confirm('Are you sure you want to clear all TV shows from your wishlist?')) {
      this.wishlistService.clearTVShows();
    }
  }

  goToDetails(item: any) {
    if (item.type === 'tv') {
      this.router.navigate(['/tv', item.id]);
    } else {
      this.router.navigate(['/movie', item.id]);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
  navigateToMovies() {
    this.router.navigate(['/movies']);
  }
  
  navigateToTVShows() {
    this.router.navigate(['/tv-shows']);
  }
  
  getContentTypeLabel(type: 'movie' | 'tv'): string {
    return type === 'tv' ? 'TV Show' : 'Movie';
  }


  getImageUrl(path: string): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}