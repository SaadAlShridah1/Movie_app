import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly availableLanguages: Language[] = [
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'ar', name: 'العربية', direction: 'rtl' },
    { code: 'fr', name: 'Français', direction: 'ltr' },
    { code: 'zh', name: '中文', direction: 'ltr' }
  ];

  private currentLanguage = signal<Language>(this.availableLanguages[0]); 

  getCurrentLanguage = computed(() => this.currentLanguage());
  getDirection = computed(() => this.currentLanguage().direction);
  isRTL = computed(() => this.currentLanguage().direction === 'rtl');
  getAvailableLanguages = computed(() => this.availableLanguages);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromLocalStorage();
      this.applyLanguageToDocument();
    }
  }

  setLanguage(languageCode: string): void {
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage.set(language);
      this.saveToLocalStorage();
      this.applyLanguageToDocument();
    }
  }

  private applyLanguageToDocument(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentLang = this.currentLanguage();
      document.documentElement.lang = currentLang.code;
      document.documentElement.dir = currentLang.direction;
      
      if (currentLang.direction === 'rtl') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }
    }
  }

  private saveToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('selectedLanguage', this.currentLanguage().code);
      } catch (error) {
        console.error('Error saving language to localStorage:', error);
      }
    }
  }

  private loadFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          const language = this.availableLanguages.find(lang => lang.code === savedLanguage);
          if (language) {
            this.currentLanguage.set(language);
          }
        }
      } catch (error) {
        console.error('Error loading language from localStorage:', error);
      }
    }
  }
}