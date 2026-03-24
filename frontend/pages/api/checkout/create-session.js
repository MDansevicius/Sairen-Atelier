import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, origin, locale } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const prefix = locale && locale !== 'lt' ? `/${locale}` : '';

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}${prefix}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${prefix}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['LT', 'LV', 'EE', 'PL', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'FI', 'SE', 'DK', 'IE', 'PT', 'GR', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'GB', 'US'],
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
