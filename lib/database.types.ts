// Tipos generados manualmente a partir de supabase/schema.sql.
// En producción, regenerar con: supabase gen types typescript --linked

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          full_name: string;
          identification_number: string;
          phone: string;
          email: string;
          appointment_reason: string;
          appointment_date: string;
          appointment_time: string;
          additional_comment: string | null;
          appointment_status: string;
          assigned_advisor_id: string | null;
          item_description: string | null;
          advisor_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          identification_number: string;
          phone: string;
          email: string;
          appointment_reason: string;
          appointment_date: string;
          appointment_time: string;
          additional_comment?: string | null;
          appointment_status?: string;
          assigned_advisor_id?: string | null;
          item_description?: string | null;
          advisor_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          appointment_id: string;
          transaction_completed: boolean;
          transaction_type: string | null;
          transaction_value: number | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          transaction_completed?: boolean;
          transaction_type?: string | null;
          transaction_value?: number | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: boolean;
          brand_name: string;
          brand_subtitle: string;
          hero_banner_url: string | null;
          logo_image_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          brand_name?: string;
          brand_subtitle?: string;
          hero_banner_url?: string | null;
          logo_image_url?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
      valuation_reports: {
        Row: {
          id: string;
          appointment_id: string;
          report_url: string;
          summary: string | null;
          estimated_value: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          report_url: string;
          summary?: string | null;
          estimated_value?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["valuation_reports"]["Insert"]>;
      };
      client_documents: {
        Row: {
          id: string;
          appointment_id: string;
          file_url: string;
          file_name: string;
          uploaded_by_email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          file_url: string;
          file_name: string;
          uploaded_by_email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["client_documents"]["Insert"]>;
      };
    };
  };
}
