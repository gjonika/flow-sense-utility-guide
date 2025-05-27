export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analyses: {
        Row: {
          analysis_text: string
          created_at: string
          id: string
          post_text: string
          preset_id: string | null
        }
        Insert: {
          analysis_text: string
          created_at?: string
          id?: string
          post_text: string
          preset_id?: string | null
        }
        Update: {
          analysis_text?: string
          created_at?: string
          id?: string
          post_text?: string
          preset_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_items: {
        Row: {
          category: string
          condition_rating: string | null
          created_at: string
          dimensions: Json | null
          estimated_cost: number | null
          id: string
          item_name: string
          item_type: string | null
          notes: string | null
          priority_level: string | null
          quantity: number | null
          subcategory: string | null
          survey_id: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          category: string
          condition_rating?: string | null
          created_at?: string
          dimensions?: Json | null
          estimated_cost?: number | null
          id?: string
          item_name: string
          item_type?: string | null
          notes?: string | null
          priority_level?: string | null
          quantity?: number | null
          subcategory?: string | null
          survey_id: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          category?: string
          condition_rating?: string | null
          created_at?: string
          dimensions?: Json | null
          estimated_cost?: number | null
          id?: string
          item_name?: string
          item_type?: string | null
          notes?: string | null
          priority_level?: string | null
          quantity?: number | null
          subcategory?: string | null
          survey_id?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "assessment_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_items_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      categories_utilities: {
        Row: {
          color: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      checklist_responses: {
        Row: {
          asset_tag: string | null
          created_at: string
          id: string
          is_mandatory: boolean | null
          needs_sync: boolean | null
          notes: string | null
          qr_code: string | null
          question_category: string
          question_id: string
          question_text: string
          response_type: string
          rfid_tag: string | null
          survey_id: string
          template_id: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          asset_tag?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          needs_sync?: boolean | null
          notes?: string | null
          qr_code?: string | null
          question_category: string
          question_id: string
          question_text: string
          response_type?: string
          rfid_tag?: string | null
          survey_id: string
          template_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          asset_tag?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          needs_sync?: boolean | null
          notes?: string | null
          qr_code?: string | null
          question_category?: string
          question_id?: string
          question_text?: string
          response_type?: string
          rfid_tag?: string | null
          survey_id?: string
          template_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_responses_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_projects: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data: Json
          id?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_metadata: {
        Row: {
          created_at: string
          date: string | null
          google_message_id: string
          id: string
          is_read: boolean | null
          labels: string[] | null
          sender_email: string | null
          sender_name: string | null
          snippet: string | null
          subject: string | null
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          google_message_id: string
          id?: string
          is_read?: boolean | null
          labels?: string[] | null
          sender_email?: string | null
          sender_name?: string | null
          snippet?: string | null
          subject?: string | null
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          google_message_id?: string
          id?: string
          is_read?: boolean | null
          labels?: string[] | null
          sender_email?: string | null
          sender_name?: string | null
          snippet?: string | null
          subject?: string | null
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_sent: boolean
          suggested_replies: string[]
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_sent?: boolean
          suggested_replies: string[]
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_sent?: boolean
          suggested_replies?: string[]
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_summaries: {
        Row: {
          created_at: string
          id: string
          key_points: string[]
          priority: string
          sentiment: Json
          suggested_actions: Json
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_points: string[]
          priority: string
          sentiment: Json
          suggested_actions: Json
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_points?: string[]
          priority?: string
          sentiment?: Json
          suggested_actions?: Json
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fake_projects: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data: Json
          id?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gmail_labels: {
        Row: {
          color: string | null
          created_at: string
          id: string
          label_id: string
          message_count: number | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          label_id: string
          message_count?: number | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          label_id?: string
          message_count?: number | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          description: string | null
          id: string
          label: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          label?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          id: number
        }
        Insert: {
          content?: string
          id?: number
        }
        Update: {
          content?: string
          id?: number
        }
        Relationships: []
      }
      notion_connections: {
        Row: {
          access_token: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          workspace_id: string | null
          workspace_name: string | null
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
          workspace_name?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
          workspace_name?: string | null
        }
        Relationships: []
      }
      portfolio_sections: {
        Row: {
          content: string | null
          created_at: string
          id: string
          portfolio_id: string
          sort_order: number
          title: string
          type: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          portfolio_id: string
          sort_order?: number
          title: string
          type: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          portfolio_id?: string
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_sections_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          calendly_url: string | null
          created_at: string
          id: string
          name: string
          social: Json
          theme: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calendly_url?: string | null
          created_at?: string
          id?: string
          name: string
          social?: Json
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calendly_url?: string | null
          created_at?: string
          id?: string
          name?: string
          social?: Json
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      presets: {
        Row: {
          created_at: string
          id: string
          name: string
          system_prompt: string
          user_instruction: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          system_prompt: string
          user_instruction: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          system_prompt?: string
          user_instruction?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string | null
          link: string | null
          section_id: string
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image?: string | null
          link?: string | null
          section_id: string
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          link?: string | null
          section_id?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "portfolio_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_dashboard: {
        Row: {
          activitylogs: Json | null
          createdat: string | null
          description: string | null
          githuburl: string | null
          id: string
          ismonetized: boolean | null
          lastupdated: string | null
          name: string
          nextaction: string | null
          progress: number | null
          status: string | null
          tags: string[] | null
          type: string | null
          usefulness: number | null
          websiteurl: string | null
        }
        Insert: {
          activitylogs?: Json | null
          createdat?: string | null
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean | null
          lastupdated?: string | null
          name: string
          nextaction?: string | null
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          usefulness?: number | null
          websiteurl?: string | null
        }
        Update: {
          activitylogs?: Json | null
          createdat?: string | null
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean | null
          lastupdated?: string | null
          name?: string
          nextaction?: string | null
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          usefulness?: number | null
          websiteurl?: string | null
        }
        Relationships: []
      }
      readings_utilities: {
        Row: {
          cost: number
          created_at: string
          date: string
          id: string
          notes: string | null
          reading_value: number | null
          supplier_id: string
          user_id: string | null
        }
        Insert: {
          cost: number
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          reading_value?: number | null
          supplier_id: string
          user_id?: string | null
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          reading_value?: number | null
          supplier_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "readings_utilities_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers_utilities"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers_utilities: {
        Row: {
          category_id: string | null
          id: string
          input_type: string
          is_meter_based: boolean
          login_url: string | null
          name: string
          utility_type: string
        }
        Insert: {
          category_id?: string | null
          id?: string
          input_type?: string
          is_meter_based?: boolean
          login_url?: string | null
          name: string
          utility_type: string
        }
        Update: {
          category_id?: string | null
          id?: string
          input_type?: string
          is_meter_based?: boolean
          login_url?: string | null
          name?: string
          utility_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_utilities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories_utilities"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_media: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          survey_id: string
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          survey_id: string
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          survey_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_media_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_notes: {
        Row: {
          created_at: string
          id: string
          note_text: string
          note_type: string | null
          survey_id: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note_text: string
          note_type?: string | null
          survey_id: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note_text?: string
          note_type?: string | null
          survey_id?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_notes_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_notes_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_notes_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_templates: {
        Row: {
          category: string
          compliance_standards: string[] | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          questions: Json
          updated_at: string
        }
        Insert: {
          category: string
          compliance_standards?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          questions?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          compliance_standards?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          questions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      survey_zones: {
        Row: {
          created_at: string
          id: string
          survey_id: string
          updated_at: string
          zone_description: string | null
          zone_metadata: Json | null
          zone_name: string
          zone_subtype: string | null
          zone_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          survey_id: string
          updated_at?: string
          zone_description?: string | null
          zone_metadata?: Json | null
          zone_name: string
          zone_subtype?: string | null
          zone_type: string
        }
        Update: {
          created_at?: string
          id?: string
          survey_id?: string
          updated_at?: string
          zone_description?: string | null
          zone_metadata?: Json | null
          zone_name?: string
          zone_subtype?: string | null
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_zones_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_zones_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          client_contacts: Json | null
          client_country: string | null
          client_name: string
          created_at: string
          custom_fields: Json | null
          duration: number | null
          flight_details: Json | null
          hotel_details: Json | null
          id: string
          last_synced_at: string | null
          needs_sync: boolean | null
          project_scope: string | null
          ship_name: string
          status: string
          survey_date: string
          survey_location: string
          tools: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_contacts?: Json | null
          client_country?: string | null
          client_name: string
          created_at?: string
          custom_fields?: Json | null
          duration?: number | null
          flight_details?: Json | null
          hotel_details?: Json | null
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          project_scope?: string | null
          ship_name: string
          status?: string
          survey_date: string
          survey_location: string
          tools?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_contacts?: Json | null
          client_country?: string | null
          client_name?: string
          created_at?: string
          custom_fields?: Json | null
          duration?: number | null
          flight_details?: Json | null
          hotel_details?: Json | null
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          project_scope?: string | null
          ship_name?: string
          status?: string
          survey_date?: string
          survey_location?: string
          tools?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      telegram_connections: {
        Row: {
          chat_id: string
          created_at: string
          first_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string
          first_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          first_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          company: string | null
          created_at: string
          id: string
          name: string
          position: string | null
          section_id: string
          text: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name: string
          position?: string | null
          section_id: string
          text: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          position?: string | null
          section_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "portfolio_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          google_access_token: string | null
          google_refresh_token: string | null
          google_token_expiry: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_reply_enabled: boolean
          created_at: string
          desktop_notifications_enabled: boolean
          id: string
          notion_tasks_enabled: boolean
          telegram_notifications_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_reply_enabled?: boolean
          created_at?: string
          desktop_notifications_enabled?: boolean
          id?: string
          notion_tasks_enabled?: boolean
          telegram_notifications_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_reply_enabled?: boolean
          created_at?: string
          desktop_notifications_enabled?: boolean
          id?: string
          notion_tasks_enabled?: boolean
          telegram_notifications_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      utility_entries: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string | null
          previous_reading: number | null
          reading_date: string | null
          reading_value: number | null
          supplier_id: string | null
          usage: number | null
          utility_supplier_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          previous_reading?: number | null
          reading_date?: string | null
          reading_value?: number | null
          supplier_id?: string | null
          usage?: number | null
          utility_supplier_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          previous_reading?: number | null
          reading_date?: string | null
          reading_value?: number | null
          supplier_id?: string | null
          usage?: number | null
          utility_supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utility_entries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "utility_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "utility_entries_utility_supplier_id_fkey"
            columns: ["utility_supplier_id"]
            isOneToOne: false
            referencedRelation: "utility_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_suppliers: {
        Row: {
          color: string | null
          created_at: string | null
          has_meter: boolean | null
          id: string
          name: string
          unit: string | null
          utility_type: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          has_meter?: boolean | null
          id?: string
          name: string
          unit?: string | null
          utility_type: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          has_meter?: boolean | null
          id?: string
          name?: string
          unit?: string | null
          utility_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      survey_analytics: {
        Row: {
          compliant_items: number | null
          issues_found: number | null
          mandatory_skipped: number | null
          not_applicable: number | null
          ship_name: string | null
          status: string | null
          survey_id: string | null
          survey_location: string | null
          total_evidence_files: number | null
          total_responses: number | null
        }
        Relationships: []
      }
      survey_issues_by_category: {
        Row: {
          issue_count: number | null
          question_category: string | null
          survey_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
