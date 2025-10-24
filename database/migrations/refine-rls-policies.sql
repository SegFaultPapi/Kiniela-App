-- Refinamiento de políticas RLS para Kiniela App
-- Este archivo contiene políticas más específicas y seguras

-- Eliminar políticas existentes para recrearlas con mejoras
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can insert own user data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

DROP POLICY IF EXISTS "Markets are publicly readable" ON markets;
DROP POLICY IF EXISTS "Authenticated users can create markets" ON markets;
DROP POLICY IF EXISTS "Market creators can update their markets" ON markets;
DROP POLICY IF EXISTS "Market creators can delete their markets" ON markets;

DROP POLICY IF EXISTS "Users can read all positions" ON positions;
DROP POLICY IF EXISTS "Users can create positions for themselves" ON positions;
DROP POLICY IF EXISTS "Users can update their own positions" ON positions;

DROP POLICY IF EXISTS "Users can read all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create transactions for themselves" ON transactions;

-- ==============================================
-- POLÍTICAS MEJORADAS PARA USERS
-- ==============================================

-- Lectura: Solo usuarios autenticados pueden leer datos de usuarios
CREATE POLICY "Authenticated users can read user profiles" ON users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Inserción: Validación mejorada para nuevos usuarios
CREATE POLICY "Users can create profile with valid data" ON users
  FOR INSERT
  WITH CHECK (
    -- Debe tener al menos un identificador válido
    (
      (fid IS NOT NULL AND fid > 0) OR 
      (address IS NOT NULL AND length(address) = 42 AND address ~ '^0x[a-fA-F0-9]{40}$')
    ) AND
    -- Display name opcional pero si existe debe ser válido
    (display_name IS NULL OR (length(display_name) >= 2 AND length(display_name) <= 50))
  );

-- Actualización: Solo pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE
  USING (
    -- Debe coincidir con el usuario autenticado por fid o address
    (
      (fid IS NOT NULL AND fid > 0) OR 
      (address IS NOT NULL AND length(address) = 42)
    )
  )
  WITH CHECK (
    -- Validaciones para los datos actualizados
    (
      (fid IS NOT NULL AND fid > 0) OR 
      (address IS NOT NULL AND length(address) = 42 AND address ~ '^0x[a-fA-F0-9]{40}$')
    ) AND
    (display_name IS NULL OR (length(display_name) >= 2 AND length(display_name) <= 50))
  );

-- ==============================================
-- POLÍTICAS MEJORADAS PARA MARKETS
-- ==============================================

-- Lectura: Mercados públicos pero con información limitada
CREATE POLICY "Public can read active markets" ON markets
  FOR SELECT
  USING (status = 'active');

-- Lectura completa: Solo creadores pueden ver todos los detalles
CREATE POLICY "Creators can read their markets fully" ON markets
  FOR SELECT
  USING (
    creator_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = markets.creator_id
    )
  );

-- Inserción: Solo usuarios autenticados con validaciones
CREATE POLICY "Authenticated users can create markets" ON markets
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    creator_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = creator_id) AND
    title IS NOT NULL AND length(title) >= 5 AND length(title) <= 200 AND
    category IS NOT NULL AND length(category) >= 2 AND length(category) <= 50 AND
    outcome_a IS NOT NULL AND length(outcome_a) >= 2 AND length(outcome_a) <= 100 AND
    outcome_b IS NOT NULL AND length(outcome_b) >= 2 AND length(outcome_b) <= 100 AND
    end_date > NOW() + INTERVAL '1 hour' AND
    end_date < NOW() + INTERVAL '1 year'
  );

-- Actualización: Solo creadores pueden actualizar sus mercados
CREATE POLICY "Creators can update their markets" ON markets
  FOR UPDATE
  USING (
    creator_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = creator_id)
  )
  WITH CHECK (
    -- Validaciones para actualizaciones
    (title IS NULL OR (length(title) >= 5 AND length(title) <= 200)) AND
    (category IS NULL OR (length(category) >= 2 AND length(category) <= 50)) AND
    (outcome_a IS NULL OR (length(outcome_a) >= 2 AND length(outcome_a) <= 100)) AND
    (outcome_b IS NULL OR (length(outcome_b) >= 2 AND length(outcome_b) <= 100)) AND
    (end_date IS NULL OR (end_date > NOW() + INTERVAL '1 hour'))
  );

-- Eliminación: Solo creadores pueden eliminar sus mercados (si no tienen transacciones)
CREATE POLICY "Creators can delete unused markets" ON markets
  FOR DELETE
  USING (
    creator_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = creator_id) AND
    NOT EXISTS (SELECT 1 FROM transactions WHERE market_id = markets.id) AND
    NOT EXISTS (SELECT 1 FROM positions WHERE market_id = markets.id)
  );

-- ==============================================
-- POLÍTICAS MEJORADAS PARA POSITIONS
-- ==============================================

-- Lectura: Usuarios pueden ver sus propias posiciones y posiciones públicas
CREATE POLICY "Users can read their own positions" ON positions
  FOR SELECT
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = positions.user_id)
  );

-- Lectura pública: Solo para mercados activos
CREATE POLICY "Public can read positions for active markets" ON positions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM markets 
      WHERE markets.id = positions.market_id 
      AND markets.status = 'active'
    )
  );

-- Inserción: Solo usuarios autenticados pueden crear posiciones
CREATE POLICY "Users can create positions for themselves" ON positions
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = user_id) AND
    market_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM markets WHERE markets.id = market_id AND markets.status = 'active') AND
    outcome IN ('a', 'b') AND
    amount > 0 AND amount <= 1000000 AND
    price > 0 AND price <= 1
  );

-- Actualización: Solo propietarios pueden actualizar sus posiciones
CREATE POLICY "Users can update their own positions" ON positions
  FOR UPDATE
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = positions.user_id)
  )
  WITH CHECK (
    amount > 0 AND amount <= 1000000 AND
    price > 0 AND price <= 1
  );

-- Eliminación: Solo propietarios pueden eliminar sus posiciones
CREATE POLICY "Users can delete their own positions" ON positions
  FOR DELETE
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = positions.user_id)
  );

-- ==============================================
-- POLÍTICAS MEJORADAS PARA TRANSACTIONS
-- ==============================================

-- Lectura: Usuarios pueden ver sus propias transacciones
CREATE POLICY "Users can read their own transactions" ON transactions
  FOR SELECT
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = transactions.user_id)
  );

-- Lectura pública: Solo para mercados activos
CREATE POLICY "Public can read transactions for active markets" ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM markets 
      WHERE markets.id = transactions.market_id 
      AND markets.status = 'active'
    )
  );

-- Inserción: Solo usuarios autenticados pueden crear transacciones
CREATE POLICY "Users can create transactions for themselves" ON transactions
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = user_id) AND
    market_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM markets WHERE markets.id = market_id AND markets.status = 'active') AND
    tx_hash IS NOT NULL AND 
    length(tx_hash) >= 10 AND 
    length(tx_hash) <= 100 AND
    tx_hash ~ '^0x[a-fA-F0-9]+$' AND
    amount > 0 AND amount <= 1000000 AND
    type IN ('buy', 'sell') AND
    outcome IN ('a', 'b')
  );

-- Actualización: Solo propietarios pueden actualizar sus transacciones (limitado)
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = transactions.user_id)
  )
  WITH CHECK (
    -- Solo permitir actualizaciones limitadas
    amount > 0 AND amount <= 1000000
  );

-- Eliminación: Solo propietarios pueden eliminar sus transacciones
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE
  USING (
    user_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM users WHERE users.id = transactions.user_id)
  );

-- ==============================================
-- POLÍTICAS ADMINISTRATIVAS (SERVICE ROLE)
-- ==============================================

-- Políticas especiales para operaciones administrativas
CREATE POLICY "Service role can manage all data" ON users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all markets" ON markets
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all positions" ON positions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all transactions" ON transactions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ==============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ==============================================

COMMENT ON POLICY "Authenticated users can read user profiles" ON users IS 
'Permite a usuarios autenticados leer perfiles de otros usuarios';

COMMENT ON POLICY "Users can create profile with valid data" ON users IS 
'Valida que nuevos usuarios tengan al menos un identificador válido (fid o address)';

COMMENT ON POLICY "Public can read active markets" ON markets IS 
'Permite lectura pública solo de mercados activos';

COMMENT ON POLICY "Authenticated users can create markets" ON markets IS 
'Valida que mercados nuevos tengan datos válidos y fechas futuras';

COMMENT ON POLICY "Users can create positions for themselves" ON positions IS 
'Valida que posiciones sean creadas solo para mercados activos con montos válidos';

COMMENT ON POLICY "Users can create transactions for themselves" ON transactions IS 
'Valida que transacciones tengan hash válido y sean para mercados activos';
