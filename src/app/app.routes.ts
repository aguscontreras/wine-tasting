import { Routes } from '@angular/router';
import { sessionGuard } from './guards/session.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
    pathMatch: 'full',
  },
  {
    path: 'room',
    loadComponent: () => import('../pages/room/room').then((m) => m.Room),
    canActivate: [sessionGuard],
  },
  {
    path: 'ranking',
    loadComponent: () => import('../pages/ranking/ranking').then((m) => m.Ranking),
    canActivate: [sessionGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('../pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
];
