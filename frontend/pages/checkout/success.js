import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTranslations } from '../../lib/i18n';

export default function CheckoutSuccess() {
  const { locale } = useRouter();
  const t = getTranslations(locale || 'lt');

  return (
    <>
      <Head>
        <title>{t.paymentSuccessTitle}</title>
      </Head>
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f1f1', color: '#3a2f33', padding: '1rem' }}>
        <section style={{ textAlign: 'center', maxWidth: '560px', background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(181,112,127,0.3)', borderRadius: '20px', padding: '2rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.5rem', margin: '0 0 0.5rem' }}>{t.paymentSuccessHeading}</h1>
          <p style={{ margin: '0 0 1rem' }}>{t.paymentSuccessBody}</p>
          <Link href="/" style={{ color: '#b5707f', fontWeight: 700 }}>{t.returnHome}</Link>
        </section>
      </main>
    </>
  );
}
