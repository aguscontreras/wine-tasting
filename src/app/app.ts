import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CataRealtime, Cata, User, Loading } from '../services';
import { environment } from '../environments/environment';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from '@spartan-ng/brain/sonner';
import { GlobalLoading } from '../components/global-loading/global-loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoading, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly route = inject(ActivatedRoute);
  private readonly cataRealtime = inject(CataRealtime);
  private readonly cataService = inject(Cata);
  private readonly assistantService = inject(User);
  protected readonly title = signal('wine-tasting');
  private readonly loading = inject(Loading);

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const room = params.get('room');
      if (room) {
        this.proccessRoom(room);
      }
    });

    this.cataRealtime.votingEnabled$.subscribe((res) => console.log(res));
  }

  private async proccessRoom(code: string) {
    try {
      const [cataCode, assistantCode] = this.validateRoom(code);

      this.loading.show('Validando cata...');

      const cata = await this.cataService.getCataByCode(cataCode);
    
      this.cataRealtime.listenVotingEnabledChanges(cata.id);

      const assistant = await this.assistantService.getUserByCode(assistantCode, cata.id);

      if (!environment.production) {
        console.log({ assistant, cata });
      }

      toast.success('Bienvenido/a a la cata!', {
        description: 'Hora de empezar a votar',
      });
    } catch (error) {
      toast.error('Codigo de cata o asistente invalido');
      console.error('[APP] Invalid cata or assistant code');
    } finally {
      this.loading.hide();
    }
  }

  private validateRoom(code: string) {
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
