const createBalanceTable = `
  CREATE TABLE IF NOT EXISTS balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    value FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

export default createBalanceTable;
