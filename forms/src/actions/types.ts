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

export type KdnkFetchResponse<RecordType> =
  | {
      data: RecordType;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    };

export type KdnkDeleteResponse = {
  error?: string;
};
