import { inject, Service } from '@angular/core';
import { Db } from '../db/db';
import { Assistant, Vote, Wine } from '../models';

@Service()
export class Votations {
  private client = inject(Db).supabaseClient;

  async setVote(points: Vote['points'], wineId: Wine['id'], assistantId: Assistant['id']) {
    const { data, error } = await this.client.from('votos').upsert(
      {
        points,
        assistant_id: assistantId,
        wine_id: wineId,
      },
      { onConflict: 'assistant_id,wine_id' },
    );

    if (error) throw error;
    return data;
  }
}
