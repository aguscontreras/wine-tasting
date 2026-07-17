import { inject, Service, signal } from '@angular/core';
import { Db } from '../db/db';
import { Cata } from '../models';

@Service()
export class Catas {
  private client = inject(Db).supabaseClient;
  readonly activeCata = signal<Cata | null>(null);

  selectActiveCata(id: Cata['id']): Promise<Cata>;
  selectActiveCata(code: Cata['code']): Promise<Cata>;
  async selectActiveCata(identifier: Cata['code'] | Cata['id']): Promise<Cata> {
    let cata: Cata | null = null;

    if (typeof identifier === 'string') {
      cata = await this.getCataByCode(identifier);
    } else {
      cata = await this.getCataById(identifier);
    }

    if (cata === null) {
      throw new Error('No se encontro la cata');
    }

    this.activeCata.set(cata);
    return cata;
  }

  async getCataById(id: Cata['id']): Promise<Cata> {
    const { data, error } = await this.client.from('catas').select('*').eq('id', id).single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getCataByCode(code: Cata['code']): Promise<Cata> {
    const { data, error } = await this.client.from('catas').select('*').eq('code', code).single();

    if (error) {
      throw error;
    }

    return data;
  }

  async toggleVotingEnabled(cataId: Cata['id'], enabled: boolean): Promise<boolean> {
    const { data, error } = await this.client
      .from('catas')
      .update({ voting_enabled: enabled })
      .eq('id', cataId)
      .select('voting_enabled')
      .single();

    if (error) {
      throw error;
    }

    return data?.voting_enabled ?? false;
  }
}
