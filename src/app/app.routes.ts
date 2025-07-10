import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { TVDetailsComponent } from './components/tv-details/tv-details.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SearchComponent } from './components/search/search.component';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { TVShowsPageComponent } from './components/tv-shows-page/tv-shows-page.component';
import { MoviesPageComponent } from './components/movies-page/movies-page.component';

export const routes: Routes = [
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'tv/:id', component: TVDetailsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'search', component: SearchComponent },
  { path: '', component: ContentTabsComponent },
  { path: 'tv-shows', component: TVShowsPageComponent },
  { path: 'movies', component: MoviesPageComponent },
  { path: '**', redirectTo: '' }
];