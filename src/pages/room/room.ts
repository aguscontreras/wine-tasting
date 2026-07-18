import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { hlmH2, hlmLead, hlmMuted } from '@spartan-ng/helm/typography';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEyeOff, lucideHatGlasses, lucidePartyPopper, lucideWine } from '@ng-icons/lucide';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { Assistants, CataRealtime, Catas, Votations, Wines } from '../../services';
import { Assistant, Cata, Wine, WineWithMetadata } from '../../models';

@Component({
  selector: 'app-room',
  imports: [
    CommonModule,
    HlmItemImports,
    HlmButtonImports,
    HlmBadgeImports,
    HlmDrawerImports,
    HlmSkeletonImports,
    HlmSpinnerImports,
    HlmAlertDialogImports,
    NgIcon,
  ],
  providers: [provideIcons({ lucideWine, lucidePartyPopper, lucideHatGlasses, lucideEyeOff })],
  templateUrl: './room.html',
  styleUrl: './room.scss',
})
export class Room {
  @ViewChild('isYourTurnDialog') isYourTurnDialog?: HlmAlertDialog;

  private catas = inject(Catas);
  private assistants = inject(Assistants);
  private wines = inject(Wines);
  private votations = inject(Votations);
  private cataRealtime = inject(CataRealtime);

  readonly hlmH2 = hlmH2;
  readonly hlmLead = hlmLead;
  readonly hlmMuted = hlmMuted;
  readonly assistantIsTheNext = signal(false);
  readonly activeAssistant = this.assistants.activeAssistant;
  readonly activeCata = this.catas.activeCata;
  readonly activeWines = this.wines.activeWines;
  readonly activeWine = this.wines.activeWine;
  readonly skeletonCount = [1, 2, 3];
  readonly pointsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  readonly loadingWineList = signal(false);
  readonly voting = signal(false);

  readonly isYourTurnTitle = signal('');
  private readonly isYourTurnTitles = [
    'A vender humo!... digo, vino',
    'Es tu momento de brillar',
    'El escenario es tuyo',
    'Convencenos!',
    'Todas las miradas están en vos',
    'Que empiece el show!',
    'Dale, vendé tu vino',
  ];

  constructor() {
    effect(() => {
      const activeCata = this.activeCata();
      const activeAssistant = this.activeAssistant();

      if (activeCata && activeAssistant) {
        this.getWines(activeCata.id, activeAssistant.id);
      }
    });

    this.cataRealtime.wineVotingEnabled$
      .pipe(filter(Boolean), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(({ wineName, votingEnabled, assistantId }) => {
        const activeCata = this.activeCata();
        const activeAssistant = this.activeAssistant();

        if (activeCata && activeAssistant) {
          this.getWines(activeCata.id, activeAssistant.id, votingEnabled ? wineName : undefined);

          if (assistantId === activeAssistant.id && votingEnabled) {
            this.setRandomTitle();
            this.assistantIsTheNext.set(true);
            this.showYourTurnDialog();
          }
        }
      });
  }

  openVotation(wine: WineWithMetadata, drawer: HlmDrawer) {
    this.wines.setActiveWine(wine);
    setTimeout(() => {
      drawer.open();
    }, 10);
  }

  showYourTurnDialog() {
    if (this.isYourTurnDialog) {
      this.isYourTurnDialog.open();
    }
  }

  async getWines(cataId: Cata['id'], assistantId: Assistant['id'], wineName?: Wine['name']) {
    this.loadingWineList.set(true);

    try {
      await this.wines.getWinesWithAssistants(cataId, assistantId);
      this.loadingWineList.set(false);

      if (wineName) {
        toast.success(`Ya podes votar por ${wineName}!`);
      }
    } catch (error) {
      toast.error('No se pudieron obtener los vinos', {
        description: 'Intenta nuevamente en un momento',
      });
      console.error('[ROOM] Error al obtener los vinos.');
    }
  }

  async setVote(value: number, wine: Wine, assistant: Assistant, cata: Cata, drawer: HlmDrawer) {
    this.voting.set(true);

    try {
      await this.votations.setVote(value, wine.id, assistant.id);
      await this.wines.getWinesWithAssistants(cata.id, assistant.id);
      drawer.close();
      this.voting.set(false);
      toast.success(`Votaste ${ wine.name.toUpperCase() }!`);
    } catch (error) {
      toast.error('No pudimos registrar tu voto');
      console.error(error);
    }
  }

  setRandomTitle() {
    const title = this.isYourTurnTitles[Math.floor(Math.random() * this.isYourTurnTitles.length)];
    this.isYourTurnTitle.set(title);
  }
}
