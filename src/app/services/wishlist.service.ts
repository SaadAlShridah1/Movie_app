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

  getMovieItems = computed(() => 
    this.wishlistItems().filter(item => item.type === 'movie'));

   getTVItems = computed(() => 
    this.wishlistItems().filter(item => item.type === 'tv'));
  
  movieCount = computed(() => this.getMovieItems().length);
  tvCount = computed(() => this.getTVItems().length);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromLocalStorage();
    }
  }

  addToWishlist(item: any): void {
    const wishlistItem: WishlistItem = {
      id: item.id,
       title: item.title || item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date,
      addedAt: new Date(),
      type: item.type || 'movie'
    };

    this.wishlistItems.update(items => {
      if (items.find(existingItem => existingItem.id === item.id && existingItem.type === wishlistItem.type)) {
        return items;
      }
      return [...items, wishlistItem];
    });

    this.saveToLocalStorage();
  }

  removeFromWishlist(itemId: number, type?: 'movie' | 'tv'): void {
    this.wishlistItems.update(items => 
      items.filter(item => !(item.id === itemId && (type ? item.type === type : true)))
    );
    this.saveToLocalStorage();
  }

  isInWishlist = computed(() => (itemId: number, type?: 'movie' | 'tv') => {
    return this.wishlistItems().some(item => 
      item.id === itemId && (type ? item.type === type : true));
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
  clearMovies(): void {
    this.wishlistItems.update(items => items.filter(item => item.type !== 'movie'));
    this.saveToLocalStorage();
  }
  clearTVShows(): void {
    this.wishlistItems.update(items => items.filter(item => item.type !== 'tv'));
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
          const itemsWithType = items.map((item: any) => ({
            ...item,
            type: item.type || 'movie',
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date()}));
             this.wishlistItems.set(itemsWithType);

        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }
}