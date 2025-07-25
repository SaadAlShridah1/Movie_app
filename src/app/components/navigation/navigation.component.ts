import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule,LanguageSelectorComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  navigateToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  get wishlistCount() {
    return this.wishlistService.wishlistCount();
  }
}