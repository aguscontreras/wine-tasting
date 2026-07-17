export interface Vote {
  assistant_id: number;
  created_at: string;
  id: number;
  points: number;
  wine_id: number;
}

export interface VoteInsert {
  assistant_id: number;
  created_at?: string;
  id?: number;
  points?: number;
  wine_id: number;
}
