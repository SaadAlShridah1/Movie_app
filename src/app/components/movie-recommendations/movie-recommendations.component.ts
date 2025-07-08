import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-recommendations.component.html',
  styleUrls: ['./movie-recommendations.component.scss']
})
export class MovieRecommendationsComponent implements OnInit {
  @Input() movieId!: number;
  @Output() movieSelected = new EventEmitter<number>();
  
  private movieService = inject(MovieService);
  
  recommendations: Movie[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    console.log('Recommendations component - movieId received:', this.movieId); 
    this.loadRecommendations();
  }

  async loadRecommendations() {
    try {
      console.log('Loading recommendations for movie ID:', this.movieId); 
      this.recommendations = await this.movieService.getMovieRecommendations(this.movieId);
      console.log('Loaded recommendations:', this.recommendations); 
      this.loading = false;
    } catch (error) {
      console.error('Error loading recommendations:', error);
      this.error = 'Failed to load recommendations';
      this.loading = false;
    }
  }

  onMovieClick(movieId: number) {
    this.movieSelected.emit(movieId);
  }

  getImageUrl(path: string): string {
    return this.movieService.getImageUrl(path);
  }
}