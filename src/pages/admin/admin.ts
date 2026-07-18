import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { hlmH3 } from '@spartan-ng/helm/typography';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { Catas, Wines } from '../../services';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'app-admin',
  imports: [HlmItemImports, HlmButtonImports, HlmSwitchImports],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly catas = inject(Catas);
  private readonly wines = inject(Wines);

  readonly activeCata = this.catas.activeCata;

  hlmH3 = hlmH3;

  randomizeWine() {
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    try {
      this.wines.randomizeNextActiveWine(cata.id);
    } catch (error) {
      toast.error('No se pudo randomizar el vino');
    }
  }

  toggleEnableRanking() {
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    try {
      this.catas.toggleRankingEnabled(cata.id, !cata.ranking_enabled);
    } catch (error) {
      toast.error('No se pudo activar o desactivar el ranking');
      this.catas.setActiveCata(cata);
    }
  }
}
