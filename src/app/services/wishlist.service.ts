import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WishlistItem } from '../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = signal<WishlistItem[]>([]);
  
  wishlistCount = computed(() => this.wishlistItems().length);
  getWishlistItems = computed(() => this.wishlistItems());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromLocalStorage();
    }
  }

  addToWishlist(movie: any): void {
    const wishlistItem: WishlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      addedAt: new Date()
    };

    this.wishlistItems.update(items => {
      if (items.find(item => item.id === movie.id)) {
        return items;
      }
      return [...items, wishlistItem];
    });

    this.saveToLocalStorage();
  }

  removeFromWishlist(movieId: number): void {
    this.wishlistItems.update(items => 
      items.filter(item => item.id !== movieId)
    );
    this.saveToLocalStorage();
  }

  isInWishlist = computed(() => (movieId: number) => {
    return this.wishlistItems().some(item => item.id === movieId);
  });

  toggleWishlist(movie: any): void {
    if (this.isInWishlist()(movie.id)) {
      this.removeFromWishlist(movie.id);
    } else {
      this.addToWishlist(movie);
    }
  }

  clearWishlist(): void {
    this.wishlistItems.set([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('movieWishlist', JSON.stringify(this.wishlistItems()));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  private loadFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem('movieWishlist');
        if (saved) {
          const items = JSON.parse(saved);
          this.wishlistItems.set(items);
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }
}