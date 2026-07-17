import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CataRealtime, Catas, Assistants, Loading } from '../services';
import { environment } from '../environments/environment';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from '@spartan-ng/brain/sonner';
import { GlobalLoading } from '../components/global-loading/global-loading';
import { delay } from 'rxjs';
import { PARAMS } from '../config/params';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoading, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cataRealtime = inject(CataRealtime);
  private readonly cataService = inject(Catas);
  private readonly assistantService = inject(Assistants);
  private readonly loading = inject(Loading);

  ngOnInit() {
    this.route.queryParamMap.pipe(delay(PARAMS.delayToCheckURL)).subscribe((params) => {
      const room = params.get('room');
      if (room) {
        this.proccessRoom(room);
      }
    });

    this.cataRealtime.cataVotingEnabled$.subscribe((res) => console.log(res));
  }

  private async proccessRoom(code: string) {
    try {
      const [cataCode, assistantCode] = this.validateRoom(code);

      this.loading.show('Validando cata...');

      const cata = await this.cataService.selectActiveCata(cataCode);

      this.cataRealtime.listenCataVotingEnabledChanges(cata.id);
      this.cataRealtime.listenWineVotingEnabledChanges(cata.id);

      const assistant = await this.assistantService.selectActiveAssistant(assistantCode, cata.id);

      if (!environment.production) {
        console.log({ assistant, cata });
      }

      toast.info('Bienvenido/a a la cata!', {
        description: 'Hora de empezar a votar',
      });

      setTimeout(() => {
        this.router.navigate(['/room']);
      }, PARAMS.delayToGoRoomAfterCheck);
    } catch (error) {
      toast.error('Codigo de cata o asistente invalido');
      console.error('[APP] Invalid cata or assistant code');
    } finally {
      this.loading.hide();
    }
  }

  private validateRoom(code: string) {
    if (!environment.production) {
      console.log({ code });
    }

    const [cataCode, assistantCode] = code.split('-');

    if (!cataCode) {
      throw new Error('Invalid Cata code');
    }

    if (!assistantCode) {
      throw new Error('Invalid Assistant code');
    }

    return [cataCode, assistantCode];
  }
}
