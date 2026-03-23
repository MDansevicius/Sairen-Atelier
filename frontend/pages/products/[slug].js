import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../styles/Product.module.css';
import homeStyles from '../../styles/Home.module.css';
import { allProducts } from '../../data/products';
import { useCart } from '../../context/CartContext';

export async function getStaticPaths() {
  return {
    paths: allProducts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = allProducts.find((p) => p.slug === params.slug) || null;
  return { props: { product } };
}

export default function ProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartCount,
    cartTotalLabel,
    checkoutLoading,
    checkoutError,
    addToCart,
    removeFromCart,
    startCheckout,
  } = useCart();

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.name} — SAIREN Jewelry</title>
        <meta name="description" content={product.description} />
      </Head>

      <main className={styles.page}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to shop
          </Link>
          <a className={styles.brandMark} href="/" aria-label="SAIREN home">
            SAIREN
          </a>
          <button
            className={styles.cartButton}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping bag"
          >
            <span className={styles.cartIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 8V7a5 5 0 0110 0v1h2a1 1 0 011 1l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 9a1 1 0 011-1h2zm2 0h6V7a3 3 0 00-6 0v1zm-2.98 2l.87 8.72a.5.5 0 00.5.48h9.22a.5.5 0 00.5-.48L18 10H6.02z" />
              </svg>
            </span>
            <span className={styles.cartCount}>{cartCount}</span>
          </button>
        </header>

        {/* ── Cart drawer ── */}
        {cartOpen ? (
          <aside className={homeStyles.cartDrawer} aria-label="Shopping cart">
            <div className={homeStyles.cartHeader}>
              <h2>Your Bag</h2>
              <button type="button" onClick={() => setCartOpen(false)}>Close</button>
            </div>
            {cart.length === 0 ? (
              <p className={homeStyles.cartEmpty}>Your bag is empty.</p>
            ) : (
              <>
                <ul className={homeStyles.cartList}>
                  {cart.map((item) => (
                    <li key={item.name} className={homeStyles.cartItem}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.priceLabel} x {item.quantity}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.name)}>Remove</button>
                    </li>
                  ))}
                </ul>
                <div className={homeStyles.cartFooter}>
                  <p>Total: {cartTotalLabel}</p>
                  <button type="button" onClick={startCheckout} disabled={checkoutLoading}>
                    {checkoutLoading ? 'Redirecting...' : 'Checkout'}
                  </button>
                  {checkoutError ? (
                    <span className={homeStyles.checkoutError}>{checkoutError}</span>
                  ) : null}
                </div>
              </>
            )}
          </aside>
        ) : null}

        {/* ── Product layout ── */}
        <div className={styles.productLayout}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <img
              key={activeImage}
              className={styles.mainImage}
              src={product.gallery[activeImage]}
              alt={`${product.name} — photo ${activeImage + 1}`}
            />
            <div className={styles.thumbnails}>
              {product.gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className={styles.details}>
            <p className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              {' / '}
              <Link href={`/#${product.category.toLowerCase()}`}>{product.category}</Link>
              {' / '}
              {product.name}
            </p>

            <h1 className={styles.productName}>{product.name}</h1>
            <span className={styles.materialBadge}>{product.material}</span>
            <p className={styles.price}>{product.priceLabel}</p>
            <p className={styles.description}>{product.description}</p>

            <button
              className={styles.addBtn}
              type="button"
              onClick={() => addToCart(product)}
            >
              Add to Bag
            </button>

            <p className={styles.specsTitle}>Specifications</p>
            <table className={styles.specs}>
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
