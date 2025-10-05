// lib/nonces.ts
export const nonces = new Map<string, string>();

export const getNonce = (walletAddress: string) => nonces.get(walletAddress);
export const setNonce = (walletAddress: string, nonce: string) => nonces.set(walletAddress, nonce);
export const clearNonce = (walletAddress: string) => nonces.delete(walletAddress);
