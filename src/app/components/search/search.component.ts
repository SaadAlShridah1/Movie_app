import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { LanguageService } from '../../services/language.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  movieService = inject(MovieService);
  wishlistService = inject(WishlistService);
  languageService = inject(LanguageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(false);
  error = signal('');
  hasSearched = signal(false);

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    effect(() => {
      this.languageService.getCurrentLanguage();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
        this.searchMovies();
      }
    });
  }

  getSearchTitle(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const titles: { [key: string]: string } = {
      'en': 'Search Movies',
      'ar': 'البحث عن الأفلام',
      'fr': 'Rechercher des films',
      'zh': '搜索电影'
    };
    return titles[langCode] || titles['en'];
  }

  getSearchPlaceholder(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const placeholders: { [key: string]: string } = {
      'en': 'Search for movies...',
      'ar': 'ابحث عن الأفلام...',
      'fr': 'Rechercher des films...',
      'zh': '搜索电影...'
    };
    return placeholders[langCode] || placeholders['en'];
  }

  getSearchButtonText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'Search',
      'ar': 'بحث',
      'fr': 'Rechercher',
      'zh': '搜索'
    };
    return texts[langCode] || texts['en'];
  }

  getClearButtonText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'Clear',
      'ar': 'مسح',
      'fr': 'Effacer',
      'zh': '清除'
    };
    return texts[langCode] || texts['en'];
  }

  getDiscoverTitle(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const titles: { [key: string]: string } = {
      'en': 'Discover Movies',
      'ar': 'اكتشف الأفلام',
      'fr': 'Découvrir des films',
      'zh': '发现电影'
    };
    return titles[langCode] || titles['en'];
  }

  getDiscoverDescription(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const descriptions: { [key: string]: string } = {
      'en': 'Search for your favorite movies by title, genre, or keywords',
      'ar': 'ابحث عن أفلامك المفضلة حسب العنوان أو النوع أو الكلمات المفتاحية',
      'fr': 'Recherchez vos films préférés par titre, genre ou mots-clés',
      'zh': '按标题、类型或关键词搜索您喜爱的电影'
    };
    return descriptions[langCode] || descriptions['en'];
  }

  getLoadingText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'Searching movies...',
      'ar': 'جاري البحث عن الأفلام...',
      'fr': 'Recherche de films...',
      'zh': '正在搜索电影...'
    };
    return texts[langCode] || texts['en'];
  }

  getNoResultsText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'No movies found for',
      'ar': 'لم يتم العثور على أفلام لـ',
      'fr': 'Aucun film trouvé pour',
      'zh': '未找到相关电影'
    };
    return texts[langCode] || texts['en'];
  }

  getTryDifferentText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'Try searching with different keywords',
      'ar': 'حاول البحث بكلمات مختلفة',
      'fr': 'Essayez de rechercher avec des mots-clés différents',
      'zh': '尝试使用不同的关键词搜索'
    };
    return texts[langCode] || texts['en'];
  }

  getFoundResultsText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'Found',
      'ar': 'تم العثور على',
      'fr': 'Trouvé',
      'zh': '找到'
    };
    return texts[langCode] || texts['en'];
  }

  getResultsForText(): string {
    const langCode = this.languageService.getCurrentLanguage().code;
    const texts: { [key: string]: string } = {
      'en': 'results for',
      'ar': 'نتيجة لـ',
      'fr': 'résultats pour',
      'zh': '个结果'
    };
    return texts[langCode] || texts['en'];
  }

  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  async searchMovies() {
    console.log('SEARCH BUTTON CLICKED!');
    const query = this.searchQuery().trim();
    if (!query) return;

    try {
      this.loading.set(true);
      this.error.set('');
      this.hasSearched.set(true);
      
      const response = await this.movieService.searchMovies(query, this.currentPage());
      
      this.searchResults.set(response.results);
      this.totalPages.set(response.total_pages);
      this.loading.set(false);
    } catch {
      this.error.set('Failed to search movies');
      this.loading.set(false);
    }
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    
    this.currentPage.set(page);
    await this.searchMovies();
  }

  async nextPage() {
    if (this.canGoNext()) {
      await this.goToPage(this.currentPage() + 1);
    }
  }

  async previousPage() {
    if (this.canGoPrevious()) {
      await this.goToPage(this.currentPage() - 1);
    }
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, Math.min(current - 2, total - 4));
      const end = Math.min(total, start + 4);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  onSearchInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  toggleWishlist(event: Event, movie: Movie) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist()(movieId);
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path);
  }
}