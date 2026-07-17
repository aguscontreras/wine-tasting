import { inject, Service, signal } from '@angular/core';
import { Db } from '../db/db';
import { Assistant, AssistantInsert } from '../models';

@Service()
export class Assistants {
  private client = inject(Db).supabaseClient;
  readonly activeAssistant = signal<Assistant | null>(null);

  selectActiveAssistant(id: Assistant['id']): Promise<Assistant>;
  selectActiveAssistant(code: Assistant['code'], cataId?: Assistant['cata_id']): Promise<Assistant>;
  async selectActiveAssistant(identifier: Assistant['code'] | Assistant['id'], cataId?: Assistant['cata_id']): Promise<Assistant> {
    let assistant: Assistant | null = null;

    if (typeof identifier === 'string' && cataId !== undefined) {
      assistant = await this.getUserByCode(identifier, cataId);
    } else if (typeof identifier === 'number') {
      assistant = await this.getUserById(identifier);
    } else {
      throw new Error('No se encontro el asistente');
    }

    if (assistant === null) {
      throw new Error('No se encontro el asistente');
    }

    this.activeAssistant.set(assistant);
    return assistant;
  }

  async addUser(user: AssistantInsert): Promise<Assistant> {
    const { data, error } = await this.client.from('asistentes').insert(user).select().single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getUserById(id: Assistant['id']): Promise<Assistant | null> {
    const { data, error } = await this.client.from('asistentes').select('*').eq('id', id).single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getUserByCode(
    code: Assistant['code'],
    cataId: Assistant['cata_id'],
  ): Promise<Assistant | null> {
    const { data, error } = await this.client
      .from('asistentes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('cata_id', cataId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllUsers(): Promise<Assistant[]> {
    const { data, error } = await this.client.from('asistentes').select('*').order('name');

    if (error) {
      throw error;
    }

    return data;
  }
}
