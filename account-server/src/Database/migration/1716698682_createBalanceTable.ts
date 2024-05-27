const createBalanceTable = `
  CREATE TABLE IF NOT EXISTS balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    value FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS balance_user_id ON balance (user_id);
`;

export default createBalanceTable;
