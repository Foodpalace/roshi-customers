/** Fail closed: never leak whether another customer's row exists. */
export function assertOwned<T extends { user_id: string }>(row: T | null | undefined, userId: string): T {
  if (!row || row.user_id !== userId) {
    throw new Error("Not found");
  }
  return row;
}

export function rejectClientPrice(clientTotal: unknown): void {
  if (clientTotal !== undefined && clientTotal !== null) {
    throw new Error("Client totals are ignored. Quote on the server.");
  }
}
