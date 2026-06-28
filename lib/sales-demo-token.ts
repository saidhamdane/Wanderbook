import crypto from 'crypto';

export function generateSalesDemoToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function isSalesDemoToken(value: string): boolean {
  return /^[0-9a-f]{64}$/.test(value);
}
