-- Esquemas básicos para Kiniela App
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- Tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid INTEGER UNIQUE, -- Farcaster ID
  address TEXT UNIQUE, -- Wallet address
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mercados
CREATE TABLE markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  outcome_a TEXT NOT NULL,
  outcome_b TEXT NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  creator_id UUID REFERENCES users(id),
  total_volume DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de posiciones
CREATE TABLE positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  market_id UUID REFERENCES markets(id),
  outcome TEXT CHECK (outcome IN ('a', 'b')),
  amount DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  market_id UUID REFERENCES markets(id),
  tx_hash TEXT UNIQUE NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT CHECK (type IN ('buy', 'sell')),
  outcome TEXT CHECK (outcome IN ('a', 'b')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices básicos
CREATE INDEX idx_markets_category ON markets(category);
CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_positions_user_id ON positions(user_id);
CREATE INDEX idx_positions_market_id ON positions(market_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_market_id ON transactions(market_id);

-- RLS básico (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir lectura pública, escritura solo para usuarios autenticados)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Markets are publicly readable" ON markets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create markets" ON markets FOR INSERT WITH CHECK (true);

CREATE POLICY "Positions are readable by owner" ON positions FOR SELECT USING (true);
CREATE POLICY "Users can create own positions" ON positions FOR INSERT WITH CHECK (true);

CREATE POLICY "Transactions are readable by owner" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (true);



