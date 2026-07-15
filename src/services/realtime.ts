import { inject, Service } from '@angular/core';
import { Db } from '../db/db';
import {
  postgresChangesFilter,
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Service()
export class CataRealtime {
  private db = inject(Db);
  private client = this.db.supabaseClient;
  private channel?: RealtimeChannel;

  readonly votingEnabled$ = new BehaviorSubject<boolean>(false);
  readonly cataChannelStatus$ = new BehaviorSubject<REALTIME_SUBSCRIBE_STATES>(
    REALTIME_SUBSCRIBE_STATES.CLOSED,
  );

  listenVotingEnabledChanges(cataId: number) {
    this.channel = this.client
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
          this.votingEnabled$.next(payload.new['voting_enabled']);
        },
      )
      .subscribe((status, err) => {
        console.log('Estado del canal:', status, err);
        this.cataChannelStatus$.next(status);
      });
  }

  ngOnDestroy() {
    if (this.channel) {
      this.client.removeChannel(this.channel);
    }
  }
}
