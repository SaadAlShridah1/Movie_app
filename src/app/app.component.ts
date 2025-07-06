import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoviesListComponent } from './components/movies-list/movies-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MoviesListComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'movie-app';
}