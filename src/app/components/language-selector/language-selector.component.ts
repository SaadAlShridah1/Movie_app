import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  languageService = inject(LanguageService);

  languagesWithDisplayText = computed(() => {
    return this.languageService.getAvailableLanguages().map(language => ({
      ...language,
      displayText: language.code === 'ar' ? language.name : language.code.toUpperCase().slice(0, 2)
    }));
  });

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLanguage = target.value;
    
    this.languageService.setLanguage(selectedLanguage);
  }
}