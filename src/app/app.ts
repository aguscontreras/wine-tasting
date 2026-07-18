import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLinkWithHref,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { delay, filter, map, startWith } from 'rxjs';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { Assistants, Catas, Loading, Rooms } from '../services';
import { GlobalLoading } from '../components/global-loading/global-loading';
import { PARAMS } from '../config/params';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    GlobalLoading,
    HlmNavigationMenuImports,
    HlmToasterImports,
    RouterLinkWithHref,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cata = inject(Catas);
  private readonly assistant = inject(Assistants);
  private readonly rooms = inject(Rooms);
  private readonly loading = inject(Loading);
  readonly activeCata = this.cata.activeCata;
  readonly activeAssistant = this.assistant.activeAssistant;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly isHomePage = computed(() => {
    const path = this.currentUrl().split(/[?#]/)[0];
    return path === '/' || path === '';
  });

  ngOnInit() {
    this.route.queryParamMap.pipe(delay(PARAMS.delayToCheckURL)).subscribe((params) => {
      const room = params.get('room');
      if (room) {
        this.proccessRoom(room);
      }
    });
  }

  private async proccessRoom(code: string) {
    try {
      this.loading.show('Validando cata...');
      await this.rooms.proccessRoom(code);

      toast.info('Bienvenido/a a la cata!', {
        description: 'Hora de empezar a votar',
      });

      setTimeout(() => {
        this.router.navigate(['/room']);
      }, PARAMS.delayToGoRoomAfterCheck);
    } catch {
      toast.error('Codigo de cata o asistente invalido');
    } finally {
      this.loading.hide();
    }
  }
}
