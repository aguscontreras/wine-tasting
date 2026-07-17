import { Routes } from '@angular/router';
import { Room } from '../pages/room/room';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
    pathMatch: 'full',
  },
  {
    path: 'room',
    loadComponent: () => import('../pages/room/room').then((m) => m.Room),
  },
];
