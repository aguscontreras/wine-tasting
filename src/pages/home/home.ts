import { Component } from '@angular/core';
import { hlmH1, hlmLead } from '@spartan-ng/helm/typography';
import { HlmFieldImports } from '../../../libs/ui/field/src';
import { HlmButtonGroupImports } from '../../../libs/ui/button-group/src';
import { HlmButtonImports } from '../../../libs/ui/button/src';
import { HlmInputImports } from '../../../libs/ui/input/src';
import { HlmCardImports } from '../../../libs/ui/card/src';
import { HlmLabelImports } from '../../../libs/ui/label/src';
import { FormsModule, NgForm } from '@angular/forms';

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
  readonly hlmH1 = hlmH1;
  readonly hlmLead = hlmLead;
  code = '';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      throw new Error('Invalid form');
    }

    console.log('Form submitted:', form.value);
  }
}
