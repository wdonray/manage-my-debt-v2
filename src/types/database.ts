export type Debt = {
  id: number // bigint maps to number in TypeScript
  user_id: string
  name?: string
  balance: number
  apr: number
  min_payment: number
  extra_payment?: number
  status: 'current' | 'behind' | 'paid_off' | 'paused' | 'closed' | null
  // Represent timestamp without time zone as string
  start_date?: string
  due_date?: string
  priority_order?: number
  // Represent timestamp with time zone as string
  created_at: string
  // Represent timestamp without time zone as string
  updated_at: string | null
}

// Type for data required to create a new debt
export type DebtCreatePayload = Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>

// Type for data allowed when updating a debt (all fields optional)
export type DebtUpdatePayload = Partial<DebtCreatePayload>

// --- Profile Types ---
export type Profile = {
  id: string // Matches auth.users.id (UUID)
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  updated_at: string | null // Timestamp with time zone
  email: string | null
}

export type ProfileUpdatePayload = Partial<Omit<Profile, 'id' | 'updated_at'>>
// --- End Profile Types ---

export type Database = {
  public: {
    Tables: {
      debts: {
        Row: Debt
        // Use the specific type for inserts
        Insert: DebtCreatePayload & { user_id: string } // Add user_id back as it's needed for insert
        // Use the specific type for updates
        Update: DebtUpdatePayload
      }
      // Add profiles table definition
      profiles: {
        Row: Profile
        // Insert typically handled by trigger/function on user creation
        Insert: Omit<Profile, 'updated_at'>
        Update: ProfileUpdatePayload
      }
    }
  }
}
