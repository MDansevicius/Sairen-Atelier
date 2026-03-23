import Head from 'next/head';
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.css';

const bracelets = [
  {
    name: 'Starlit Cuff',
    priceLabel: 'EUR 119',
    priceCents: 11900,
    material: 'Gold-plated brass',
    image:
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Velvet Chain Bracelet',
    priceLabel: 'EUR 89',
    priceCents: 8900,
    material: 'Sterling silver',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Northern Charm Stack',
    priceLabel: 'EUR 149',
    priceCents: 14900,
    material: '14k rose finish',
    image:
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80',
  },
];

const necklaces = [
  {
    name: 'Moonline Pendant',
    priceLabel: 'EUR 129',
    priceCents: 12900,
    material: 'Silver and moonstone',
    image:
      'https://images.unsplash.com/photo-1599643478518-17488fbbcd77?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Aurora Drop Chain',
    priceLabel: 'EUR 109',
    priceCents: 10900,
    material: 'Gold vermeil',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Halo Pearl Thread',
    priceLabel: 'EUR 159',
    priceCents: 15900,
    material: 'Freshwater pearl',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
  },
];

function ProductCard({ product, index, onAdd }) {
  return (
    <article className={styles.productCard} style={{ animationDelay: `${index * 90}ms` }}>
      <img className={styles.productImage} src={product.image} alt={product.name} />
      <div className={styles.productBody}>
        <h3>{product.name}</h3>
        <p>{product.material}</p>
        <div className={styles.productMeta}>
          <strong>{product.priceLabel}</strong>
          <button type="button" onClick={() => onAdd(product)}>Add to Bag</button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [cart, setCart] = useState([]);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartTotalLabel = useMemo(() => {
    const totalCents = cart.reduce((total, item) => total + item.priceCents * item.quantity, 0);
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(totalCents / 100);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const startCheckout = async () => {
    if (cart.length === 0 || checkoutLoading) {
      return;
    }

    setCheckoutError('');
    setCheckoutLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          items: cart.map((item) => ({
            name: item.name,
            priceCents: item.priceCents,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Unable to start checkout.');
      }

      window.location.href = payload.url;
    } catch (error) {
      setCheckoutError(error.message || 'Checkout failed.');
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SAIREN Jewelry | Bracelets and Necklaces</title>
        <meta
          name="description"
          content="Discover SAIREN's curated bracelets and necklaces crafted for daily elegance."
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.brandHeader}>
          <a className={styles.brandMark} href="/" aria-label="SAIREN home">
            SAIREN
          </a>
          <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}>
            <span className={styles.cartIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label="Shopping bag icon">
                <path d="M7 8V7a5 5 0 0110 0v1h2a1 1 0 011 1l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 9a1 1 0 011-1h2zm2 0h6V7a3 3 0 00-6 0v1zm-2.98 2l.87 8.72a.5.5 0 00.5.48h9.22a.5.5 0 00.5-.48L18 10H6.02z" />
              </svg>
            </span>
            <span className={styles.cartCount}>{cartCount}</span>
          </button>
        </header>

        {cartOpen ? (
          <aside className={styles.cartDrawer} aria-label="Shopping cart">
            <div className={styles.cartHeader}>
              <h2>Your Bag</h2>
              <button type="button" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>

            {cart.length === 0 ? (
              <p className={styles.cartEmpty}>Your bag is empty. Add bracelets or necklaces.</p>
            ) : (
              <>
                <ul className={styles.cartList}>
                  {cart.map((item) => (
                    <li key={item.name} className={styles.cartItem}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.priceLabel} x {item.quantity}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.name)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className={styles.cartFooter}>
                  <p>Total: {cartTotalLabel}</p>
                  <button type="button" onClick={startCheckout} disabled={checkoutLoading}>
                    {checkoutLoading ? 'Redirecting...' : 'Checkout'}
                  </button>
                  {checkoutError ? <span className={styles.checkoutError}>{checkoutError}</span> : null}
                </div>
              </>
            )}
          </aside>
        ) : null}

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>New Atelier Collection</span>
            <h1>Refined Jewelry for Quiet Luxury</h1>
            <p>
              Discover sculpted bracelets and delicate necklaces designed to layer, gift, and keep
              for years.
            </p>
            <div className={styles.heroActions}>
              <a href="#bracelets">Shop Bracelets</a>
              <a href="#necklaces" className={styles.ghostBtn}>
                Shop Necklaces
              </a>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <p>Hand-finished details</p>
            <p>Premium metals and stones</p>
            <p>Worldwide delivery in 3-5 days</p>
          </div>
        </section>

        <section className={styles.categoryStrip}>
          <article>
            <h2>Bracelets</h2>
            <p>Statement cuffs, chain layers, and charm stacks made to mix and match.</p>
          </article>
          <article>
            <h2>Necklaces</h2>
            <p>From minimal pendants to expressive layered lines for day-to-evening wear.</p>
          </article>
        </section>

        <section id="bracelets" className={styles.collectionSection}>
          <header className={styles.collectionHeader}>
            <span>Collection 01</span>
            <h2>Bracelets</h2>
          </header>
          <div className={styles.productGrid}>
            {bracelets.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <section id="necklaces" className={styles.collectionSection}>
          <header className={styles.collectionHeader}>
            <span>Collection 02</span>
            <h2>Necklaces</h2>
          </header>
          <div className={styles.productGrid}>
            {necklaces.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} onAdd={addToCart} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}