import { Component, inject, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { hlmH3, hlmLead } from '@spartan-ng/helm/typography';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { CataRealtime, Catas, Wines } from '../../services';
import { toast } from '@spartan-ng/brain/sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX } from '@ng-icons/lucide';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-admin',
  imports: [HlmItemImports, HlmButtonImports, HlmSwitchImports, NgIcon, HlmSpinnerImports],
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
  readonly randomizing = signal(false);
  readonly showingInfo = signal(false);

  hlmH3 = hlmH3;
  hlmH4 = hlmLead;

  async randomizeWine() {
    this.randomizing.set(true);
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    try {
      await this.wines.randomizeNextActiveWine(cata.id);
      toast.success('Vino randomizado correctamente');
    } catch (error) {
      toast.error('No se pudo randomizar el vino');
    } finally {
      this.randomizing.set(false);
    }
  }

  async toggleEnableRanking() {
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    try {
      await this.catas.toggleRankingEnabled(cata.id, !cata.ranking_enabled);
      toast.success('Ranking cambiado correctamente');
    } catch (error) {
      toast.error('No se pudo activar o desactivar el ranking');
      this.catas.setActiveCata(cata);
    }
  }

  async enableViewInfoActiveWine() {
    const cata = this.activeCata();

    if (!cata) throw new Error('Cata inexistente');

    this.showingInfo.set(true);

    try {
      await this.wines.enableViewInfoActiveWine(cata.id);
      toast.success('Vino mostrado correctamente');
    } catch (error) {
      toast.error('No se pudo mostrar la info del vino');
    } finally {
      this.showingInfo.set(false);
    }
  }
}
