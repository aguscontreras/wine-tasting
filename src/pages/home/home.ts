import { Component, inject } from '@angular/core';
import { hlmH1, hlmLead } from '@spartan-ng/helm/typography';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmFieldImports } from '../../../libs/ui/field/src';
import { HlmButtonGroupImports } from '../../../libs/ui/button-group/src';
import { HlmButtonImports } from '../../../libs/ui/button/src';
import { HlmInputImports } from '../../../libs/ui/input/src';
import { HlmCardImports } from '../../../libs/ui/card/src';
import { HlmLabelImports } from '../../../libs/ui/label/src';
import { FormsModule, NgForm } from '@angular/forms';
import { Loading, Rooms } from '../../services';
import { Router } from '@angular/router';
import { PARAMS } from '../../config/params';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    HlmCardImports,
    HlmLabelImports,
    HlmInputImports,
    HlmFieldImports,
    HlmButtonGroupImports,
    HlmButtonImports,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly rooms = inject(Rooms);
  private readonly loading = inject(Loading);
  private readonly router = inject(Router);
  readonly hlmH1 = hlmH1;
  readonly hlmLead = hlmLead;
  code = '';

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      throw new Error('Invalid form');
    }

    try {
      this.loading.show('Validando cata...');
      this.rooms.proccessRoom(form.value['code']);

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
