import { Assistant } from './assistant.model';
import { Variety } from './variety.model';
import { Vote } from './vote.model';

export interface Wine {
  assistant_id: number;
  cata_id: number;
  created_at: string;
  id: number;
  name: string;
  number: number;
  type: string | null;
  variety_id: number | null;
  voting_enabled: boolean
}

export interface WineWithMetadata extends Wine {
  assistant_name: Assistant['name'];
  points_given: Vote['points'];
  variety_name: Variety['name'] | null;
}

export interface WineInsert {
  assistant_id: number;
  cata_id: number;
  created_at?: string;
  id?: number;
  name?: string;
  number: number;
  type?: string | null;
  variety_id: number;
}

export interface WineUpdate {
  assistant_id?: number;
  cata_id?: number;
  created_at?: string;
  id?: number;
  name?: string;
  number?: number;
  type?: string | null;
  variety_id?: number;
}
