import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: '', component: MovieListComponent },
      { path: ':id', component: MovieDetailComponent },
      { path: 'profile', loadComponent: () => import('../profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
