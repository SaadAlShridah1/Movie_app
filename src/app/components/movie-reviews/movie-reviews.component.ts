import { Component, Input, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Review } from '../../interfaces/movie.interface';
import { sign } from 'crypto';

@Component({
  selector: 'app-movie-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-reviews.component.html',
  styleUrls: ['./movie-reviews.component.scss']
})
export class MovieReviewsComponent implements OnInit {
  @Input() movieId!: number; 
  
  private movieService = inject(MovieService);
  
  reviews = signal<Review[]>([]);
  loading = signal (true);
  error = signal('');

  ngOnInit() {
        console.log('Reviews component - movieId received:', this.movieId);
    this.loadReviews();
  }

  async loadReviews() {
    try {
     this.loading.set(true);
      this.error.set('');
      console.log('Loading reviews for movie ID:', this.movieId);
      const reviewsData = await this.movieService.getMovieReviews(this.movieId);
      this.reviews.set(reviewsData);
      console.log('Loaded reviews:', reviewsData);
      this.loading.set(false);

    } catch (error){
      console.error('Error loading reviews:', error);
      this.error.set('Failed to load reviews');
      this.loading.set(false);
    }
  }

  truncateReview(content: string, maxLength: number = 300): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}