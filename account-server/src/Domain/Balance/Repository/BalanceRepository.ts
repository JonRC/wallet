import { fetchByUserId } from "@/Domain/Balance/Repository/fetchByUserId";

export const BalanceRepository = () => ({
  fetchByUserId,
});

export type BalanceRepository = ReturnType<typeof BalanceRepository>;
