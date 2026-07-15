import { inject, Service, signal } from '@angular/core';
import { Db } from '../db/db';
import { Cata as CataModel } from '../models';

@Service()
export class Cata {
  private client = inject(Db).supabaseClient;
  readonly activeCata = signal<CataModel | null>(null);

  selectActiveCata(id: CataModel['id']): Promise<void>;
  selectActiveCata(code: CataModel['code']): Promise<void>;
  async selectActiveCata(identifier: CataModel['code'] | CataModel['id']): Promise<void> {
    let cata: CataModel | null = null;

    if (typeof identifier === 'string') {
      cata = await this.getCataByCode(identifier);
    } else {
      cata = await this.getCataById(identifier);
    }

    if (cata === null) {
      throw new Error('No se encontro la cata');
    }

    this.activeCata.set(cata);
  }

  async getCataById(id: CataModel['id']): Promise<CataModel> {
    const { data, error } = await this.client.from('catas').select('*').eq('id', id).single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getCataByCode(code: CataModel['code']): Promise<CataModel> {
    const { data, error } = await this.client.from('catas').select('*').eq('code', code).single();

    if (error) {
      throw error;
    }

    return data;
  }

  async toggleVotingEnabled(cataId: CataModel['id'], enabled: boolean): Promise<boolean> {
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
