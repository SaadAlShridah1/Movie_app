import { Component, inject } from '@angular/core';
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

  get wishlistItems() {
    return this.wishlistService.getWishlistItems();
  }

  get wishlistCount() {
    return this.wishlistService.wishlistCount();
  }

  removeFromWishlist(movieId: number) {
    this.wishlistService.removeFromWishlist(movieId);
  }

  clearAllWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}