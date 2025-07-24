import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LanguageService } from './services/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private languageService = inject(LanguageService);

    constructor() {
      effect(() => {
      const currentLang = this.languageService.getCurrentLanguage();
      console.log('Language changed to:', currentLang.code);
    });
  }
}

  