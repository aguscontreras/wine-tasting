import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { hlmH1, hlmLead } from '@spartan-ng/helm/typography';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmFieldImports } from '../../../libs/ui/field/src';
import { HlmButtonGroupImports } from '../../../libs/ui/button-group/src';
import { HlmButtonImports } from '../../../libs/ui/button/src';
import { HlmInputImports } from '../../../libs/ui/input/src';
import { HlmCardImports } from '../../../libs/ui/card/src';
import { HlmLabelImports } from '../../../libs/ui/label/src';
import { Loading, Rooms } from '../../services';
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
    HlmAlertDialogImports,
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

  async onSubmit(form: NgForm, dialog: HlmAlertDialog) {
    if (form.invalid) {
      throw new Error('Invalid form');
    }

    dialog.close();

    try {
      this.loading.show('Validando cata...');
      await this.rooms.proccessRoom(form.value['code']);

      toast.info('Bienvenido/a a la cata!', {
        description: 'Hora de empezar a votar',
      });

      setTimeout(() => {
        this.router.navigate(['/room']);
        this.loading.hide();
      }, PARAMS.delayToGoRoomAfterCheck);
    } catch {
      this.loading.hide();
      toast.error('Codigo de cata o asistente invalido');
    }
  }
}
