import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { hlmH3, hlmLead } from '@spartan-ng/helm/typography';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { CataRealtime, Catas, Wines } from '../../services';
import { toast } from '@spartan-ng/brain/sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX } from '@ng-icons/lucide';

@Component({
  selector: 'app-admin',
  imports: [HlmItemImports, HlmButtonImports, HlmSwitchImports, NgIcon],
  providers: [provideIcons({ lucideCircleX, lucideCircleCheck })],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly catas = inject(Catas);
  private readonly wines = inject(Wines);
  private readonly realtime = inject(CataRealtime);

  readonly activeCata = this.catas.activeCata;
  readonly cataChannelStatus = this.realtime.cataChannelStatus;
  readonly wineChannelStatus = this.realtime.wineChanelStatus;

  hlmH3 = hlmH3;
  hlmH4 = hlmLead;

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

  enableViewInfoActiveWine() {
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    this.wines.enableViewInfoActiveWine(cata.id);
  }
}
