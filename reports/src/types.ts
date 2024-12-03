export interface SupabaseDbTypes {
  public: {
    Tables: {
      [tableName: string]: {
        Row: {};
        Update: {};
        Insert: {};
      };
    };
    Views: {
      [tableName: string]: {
        Row: {};
      };
    };
  };
}
