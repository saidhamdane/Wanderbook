export type CheckoutSession = { url: string | null; id: string | null };

export async function createCheckoutSession(_priceId: string): Promise<CheckoutSession> {
  // Stub — full Stripe integration is intentionally deferred.
  return { url: null, id: null };
}
