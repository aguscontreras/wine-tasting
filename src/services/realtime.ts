import { inject, Service } from '@angular/core';
import { Db } from '../db/db';
import { postgresChangesFilter, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { Assistant, Cata, Wine } from '../models';
import { Catas } from './cata';

@Service()
export class CataRealtime {
  private db = inject(Db);
  private client = this.db.supabaseClient;
  private catas = inject(Catas);

  readonly wineVotingEnabled$ = new BehaviorSubject<{
    wineId: Wine['id'];
    wineName: Wine['name'];
    votingEnabled: Wine['voting_enabled'];
    assistantId: Assistant['id'];
    cataId: Cata['id'];
  } | null>(null);

  readonly cataChannelStatus$ = new BehaviorSubject<REALTIME_SUBSCRIBE_STATES>(
    REALTIME_SUBSCRIBE_STATES.CLOSED,
  );


  listenCataVotingEnabledChanges(cataId: Cata['id']) {
    this.client
      .channel(`cata:${cataId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'catas',
          filter: postgresChangesFilter().eq('id', cataId),
        },
        (payload) => {
          console.log(payload);
          this.catas.setActiveCata(payload.new as Cata);
        },
      )
      .subscribe((status, err) => {
        console.log('Estado del canal de CATA:', status, err);
        this.cataChannelStatus$.next(status);
      });
  }

  listenWineVotingEnabledChanges(cataId: Cata['id']) {
    this.client
      .channel(`wine:${cataId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vinos',
          filter: postgresChangesFilter().eq('cata_id', cataId),
        },
        (payload) => {
          const changed = payload.old['voting_enabled'] !== payload.new['voting_enabled'];
          if (changed) {
            const {
              id: wineId,
              name: wineName,
              voting_enabled: votingEnabled,
              assistant_id: assistantId,
              cata_id: cataId,
            } = payload.new;
            this.wineVotingEnabled$.next({ wineId, wineName, votingEnabled, assistantId, cataId });
          }
        },
      )
      .subscribe((status, err) => {
        console.log('Estado del canal de VINOS:', status, err);
        this.cataChannelStatus$.next(status);
      });
  }

  ngOnDestroy() {
    this.client.removeAllChannels();
  }
}
