import { inject, Service, signal } from '@angular/core';
import { Db } from '../db/db';
import { Assistant, Cata, Wine, WineRanking, WineWithMetadata } from '../models';
import { waitForPromise } from '../utils';
import { PARAMS } from '../config/params';

@Service()
export class Wines {
  private client = inject(Db).supabaseClient;
  readonly activeWines = signal<WineWithMetadata[]>([]);
  readonly activeWine = signal<WineWithMetadata | null>(null);

  async getWinesWithAssistants(
    cataId: Cata['id'],
    assistantId: Assistant['id'],
  ): Promise<WineWithMetadata[]> {
    await waitForPromise(PARAMS.delayToLoadWines);

    console.log({
      cataId,
      assistantId,
    });

    const { data, error } = await this.client
      .from('vinos')
      .select(
        `
        *,
        assistant_name:asistentes(name),
        variety_name:variedades(name),
        votos (points)
        `,
      )
      .eq('cata_id', cataId)
      .eq('votos.assistant_id', assistantId)
      .order('voting_enabled', { ascending: false })
      // .order('number', { ascending: true });

    if (error) throw error;

    const vinosFormateados = data.map(({ votos, ...vino }) => ({
      ...vino,
      assistant_name: vino.assistant_name?.name ?? null,
      variety_name: vino.variety_name?.name ?? null,
      points_given: votos[0]?.points ?? null,
    }));

    console.log(vinosFormateados);

    this.activeWines.set(vinosFormateados);
    return vinosFormateados;
  }

  setActiveWine(wine: WineWithMetadata) {
    this.activeWine.set(wine);
  }

  async randomizeNextActiveWine(cataId: Cata['id']): Promise<Wine | null> {
    const { data, error } = await this.client
      .from('vinos')
      .select('*')
      .eq('cata_id', cataId)
      .eq('voting_enabled', false);

    if (error) throw error;
    if (!data?.length) return null;

    console.log(data);

    const next = data[Math.floor(Math.random() * data.length)];

    const { data: updated, error: updateError } = await this.client
      .from('vinos')
      .update({ voting_enabled: true })
      .eq('id', next.id)
      .single();

    if (updateError) throw updateError;

    return updated;
  }

  async getRanking(cataId: Cata['id']): Promise<WineRanking[]> {
    const { data, error } = await this.client
      .from('ranking_vinos')
      .select('*')
      .eq('cata_id', cataId)
      .order('promedio', { ascending: false });

    if (error) throw error;
    return data;
  }
}
