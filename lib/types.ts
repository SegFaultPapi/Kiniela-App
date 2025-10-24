// Tipos básicos para la base de datos
export interface User {
  id: string
  fid?: number // Farcaster ID
  address?: string
  display_name?: string
  created_at: string
  updated_at: string
}

export interface Market {
  id: string
  title: string
  description?: string
  category: string
  outcome_a: string
  outcome_b: string
  end_date: string
  creator_id: string
  total_volume: number
  status: 'active' | 'resolved' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  user_id: string
  market_id: string
  outcome: 'a' | 'b'
  amount: number
  price: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  market_id: string
  tx_hash: string
  amount: number
  type: 'buy' | 'sell'
  outcome: 'a' | 'b'
  created_at: string
}



