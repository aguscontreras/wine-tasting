export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type WineTastingDatabase = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      asistentes: {
        Row: {
          cata_id: number;
          code: string;
          created_at: string;
          id: number;
          is_host: boolean | null;
          name: string;
        };
        Insert: {
          cata_id: number;
          code: string;
          created_at?: string;
          id?: number;
          is_host?: boolean | null;
          name: string;
        };
        Update: {
          cata_id?: number;
          code?: string;
          created_at?: string;
          id?: number;
          is_host?: boolean | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'asistentes_cata_id_fkey';
            columns: ['cata_id'];
            isOneToOne: false;
            referencedRelation: 'catas';
            referencedColumns: ['id'];
          },
        ];
      };
      catas: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          name: string;
          voting_enabled: boolean | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          name: string;
          voting_enabled?: boolean | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          name?: string;
          voting_enabled?: boolean | null;
        };
        Relationships: [];
      };
      variedades: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      vinos: {
        Row: {
          assistant_id: number;
          cata_id: number;
          created_at: string;
          id: number;
          name: string;
          number: number;
          type: string | null;
          variety_id: number;
        };
        Insert: {
          assistant_id: number;
          cata_id: number;
          created_at?: string;
          id?: number;
          name?: string;
          number: number;
          type?: string | null;
          variety_id: number;
        };
        Update: {
          assistant_id?: number;
          cata_id?: number;
          created_at?: string;
          id?: number;
          name?: string;
          number?: number;
          type?: string | null;
          variety_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'vinos_assistant_id_fkey';
            columns: ['assistant_id'];
            isOneToOne: false;
            referencedRelation: 'asistentes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vinos_cata_id_fkey';
            columns: ['cata_id'];
            isOneToOne: false;
            referencedRelation: 'catas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vinos_variety_id_fkey';
            columns: ['variety_id'];
            isOneToOne: false;
            referencedRelation: 'variedades';
            referencedColumns: ['id'];
          },
        ];
      };
      votos: {
        Row: {
          assistant_id: number;
          created_at: string;
          id: number;
          points: number;
          wine_id: number;
        };
        Insert: {
          assistant_id: number;
          created_at?: string;
          id?: number;
          points?: number;
          wine_id: number;
        };
        Update: {
          assistant_id?: number;
          created_at?: string;
          id?: number;
          points?: number;
          wine_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'votos_assistant_id_fkey';
            columns: ['assistant_id'];
            isOneToOne: false;
            referencedRelation: 'asistentes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votos_wine_id_fkey';
            columns: ['wine_id'];
            isOneToOne: false;
            referencedRelation: 'vinos';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_catas_code: { Args: { len?: number }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<WineTastingDatabase, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof WineTastingDatabase, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
