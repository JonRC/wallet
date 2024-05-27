const createTransactionItemTable = `
  CREATE TYPE transaction_item_type AS ENUM ('MAIN', 'TAX', 'FEE');

  CREATE TABLE IF NOT EXISTS transaction_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    value FLOAT NOT NULL,
    description TEXT,
    type transaction_item_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (transaction_id) REFERENCES transaction(id) ON DELETE CASCADE
  );
`;
export default createTransactionItemTable;
