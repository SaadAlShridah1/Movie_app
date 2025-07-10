import { Component, inject, signal } from '@angular/core';
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

  get allWishlistItems() {
    return this.wishlistService.getWishlistItems();
  }
  
  get movieItems() {
    return this.wishlistService.getMovieItems();
  }

  get tvItems() {
    return this.wishlistService.getTVItems();
  }

  get wishlistCount() {
    return this.wishlistService.wishlistCount();
  }
  
  get movieCount() {
    return this.wishlistService.movieCount();
  }

  get tvCount() {
    return this.wishlistService.tvCount();
  }
  
  get displayItems() {
    switch (this.activeTab()) {
      case 'movies':
        return this.movieItems;
      case 'tv':
        return this.tvItems;
      default:
        return this.allWishlistItems;
    }
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

  getStars(rating: number): { filled: boolean }[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      stars.push({ filled: i < fullStars });
    }
    
    return stars;
  }

  getMovieDescription(item: any): string {
    const descriptions = {
      'Black Widow': 'Natasha Romanoff, also known as Black Widow, confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises. Pursued by....',
      'default': 'An exciting story that will keep you on the edge of your seat with thrilling action and compelling characters in an unforgettable adventure.'
    };
    
    return descriptions[item.title as keyof typeof descriptions] || descriptions.default;
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}