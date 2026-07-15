import { inject, Service } from '@angular/core';
import { Db } from '../db/db';
import { Assistant, AssistantInsert } from '../models';

@Service()
export class User {
  private client = inject(Db).supabaseClient;

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
