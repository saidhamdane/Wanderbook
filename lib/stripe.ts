export function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://wanderbookcanarias.com'
  ).replace(/\/$/, '');
}

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY) &&
    Boolean(process.env.STRIPE_PRICE_UNLIMITED_MONTHLY);
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
