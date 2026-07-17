import { Service } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Database } from '../../database.types';

@Service()
export class Db {
  private readonly _supabaseClient = createClient<Database>(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
  );

  get supabaseClient() {
    return this._supabaseClient;
  }
}
