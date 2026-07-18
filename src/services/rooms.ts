import { inject, Service } from '@angular/core';
import { environment } from '../environments/environment';
import { CataRealtime } from './realtime';
import { Catas } from './cata';
import { Assistants } from './assistant';

@Service()
export class Rooms {
  private cataRealtime = inject(CataRealtime);
  private cataService = inject(Catas);
  private assistantService = inject(Assistants);

  async proccessRoom(code: string) {
    try {
      const [cataCode, assistantCode] = this.validateRoom(code);

      const cata = await this.cataService.selectActiveCata(cataCode);

      this.cataRealtime.listenCataChanges(cata.id);
      this.cataRealtime.listenWineChanges(cata.id);

      const assistant = await this.assistantService.selectActiveAssistant(assistantCode, cata.id);

      if (!environment.production) {
        console.log({ assistant, cata });
      }

    } catch (error) {
      console.error('[ROOMS] Invalid cata or assistant code');
      throw error;
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
