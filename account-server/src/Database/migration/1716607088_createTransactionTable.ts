const createTransactionTable = `
  CREATE TYPE transaction_type_enum AS ENUM (
    'TRANSFER',
    'OPEN_WALLET',
    'LOAN',
    'DEBIT',
    'REVERSAL',
    'TAXE',
    'FEE',
    'CASH_DEPOSIT'
  );

  CREATE TYPE receiver_type_enum AS ENUM (
    'USER',
    'PIX',
    'BANK_ACCOUNT',
    'BANK_SLIP',
    'CREDIT_CARD',
    'POS',
    'ATM'
  );

  CREATE TYPE sender_type_enum AS ENUM (
    'USER',
    'PIX',
    'BANK_ACCOUNT',
    'POS',
    'ATM'
  );

  CREATE TABLE IF NOT EXISTS transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    value FLOAT NOT NULL,
    type transaction_type_enum NOT NULL,
    receiver_type receiver_type_enum NOT NULL,
    sender_type sender_type_enum NOT NULL,

    receiver_reference TEXT NOT NULL,
    sender_reference TEXT NOT NULL,
    description TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
  );

`;

export default createTransactionTable;
