export interface Assistant {
  cata_id: number;
  code: string;
  created_at: string;
  id: number;
  is_host: boolean | null;
  name: string;
}

export interface AssistantInsert {
  cata_id: number;
  code: string;
  created_at?: string;
  id?: number;
  is_host?: boolean | null;
  name: string;
}

export interface AssistantUpdate {
  cata_id?: number;
  code?: string;
  created_at?: string;
  id?: number;
  is_host?: boolean | null;
  name?: string;
}
