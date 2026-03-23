import Head from 'next/head';
import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <>
      <Head>
        <title>Payment Cancelled | SAIREN</title>
      </Head>
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f1f1', color: '#3a2f33', padding: '1rem' }}>
        <section style={{ textAlign: 'center', maxWidth: '560px', background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(181,112,127,0.3)', borderRadius: '20px', padding: '2rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.3rem', margin: '0 0 0.5rem' }}>Checkout cancelled</h1>
          <p style={{ margin: '0 0 1rem' }}>No payment was made. Your bag items are still available to checkout.</p>
          <Link href="/" style={{ color: '#b5707f', fontWeight: 700 }}>Back to shopping</Link>
        </section>
      </main>
    </>
  );
}
