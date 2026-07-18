import { Component, inject, OnInit, signal } from '@angular/core';
import { Catas, Wines } from '../../services';
import { Cata, WineRanking } from '../../models';
import { toast } from '@spartan-ng/brain/sonner';
import { CommonModule } from '@angular/common';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmH3, hlmH4, hlmMuted, hlmP } from '@spartan-ng/helm/typography';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrophy } from '@ng-icons/lucide';

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, HlmCardImports, HlmTableImports, NgIcon],
  providers: [provideIcons({ lucideTrophy })],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
})
export class Ranking implements OnInit {
  private wines = inject(Wines);
  private catas = inject(Catas);
  
  readonly ranking = signal<WineRanking[]>([]);
  readonly hlmH3 = hlmH3;
  readonly hlmH4 = hlmH4;
  readonly hlmP = hlmP;
  readonly hlmMuted = hlmMuted;

  ngOnInit(): void {
    const activeCata = this.catas.activeCata();

    if (activeCata) {
      this.getRanking(activeCata.id);
    }
  }

  async getRanking(cataId: Cata['id']) {
    try {
      const ranking = await this.wines.getRanking(cataId);
      this.ranking.set(ranking);
    } catch (error) {
      toast.error('No se pudo obtener el ranking', { description: 'Intenta nuevamente' });
    }
  }
}
