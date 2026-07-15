import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CataRealtime } from '../services/realtime';
import { Cata, User } from '../services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly route = inject(ActivatedRoute);
  private readonly cataRealtime = inject(CataRealtime);
  private readonly cataService = inject(Cata);
  private readonly assistantService = inject(User);
  protected readonly title = signal('wine-tasting');

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
      const cata = await this.cataService.getCataByCode(cataCode);
      this.cataRealtime.listenVotingEnabledChanges(cata.id);
      console.log(cata);

      const assistant = await this.assistantService.getUserByCode(assistantCode, cata.id);
      console.log(assistant);
    } catch (error) {
      // TODO: Show error in component
      console.log('Invalid cata or assistant code');
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
