import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.css';
import { bracelets, necklaces } from '../data/products';
import { useCart } from '../context/CartContext';
import { getTranslations, withVars } from '../lib/i18n';
import { localizeProducts } from '../lib/productLocalization';

const ITEMS_PER_VIEW = 3;

function ProductCard({ product, index, onAdd, addLabel }) {
  return (
    <article className={styles.productCard} style={{ animationDelay: `${index * 90}ms` }}>
      <Link href={`/products/${product.slug}`} className={styles.productImageLink}>
        <img className={styles.productImage} src={product.image} alt={product.name} />
      </Link>
      <div className={styles.productBody}>
        <Link href={`/products/${product.slug}`} className={styles.productNameLink}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.material}</p>
        <div className={styles.productMeta}>
          <strong>{product.priceLabel}</strong>
          <button type="button" onClick={() => onAdd(product)}>{addLabel}</button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { locale } = useRouter();
  const t = getTranslations(locale || 'lt');
  const localizedBracelets = useMemo(
    () => localizeProducts(bracelets, locale || 'lt'),
    [locale]
  );
  const localizedNecklaces = useMemo(
    () => localizeProducts(necklaces, locale || 'lt'),
    [locale]
  );
  const [braceletsStart, setBraceletsStart] = useState(0);
  const [necklacesStart, setNecklacesStart] = useState(0);

  const visibleBracelets = useMemo(() => {
    if (localizedBracelets.length <= ITEMS_PER_VIEW) {
      return localizedBracelets;
    }
    return Array.from({ length: ITEMS_PER_VIEW }, (_, offset) => {
      const index = (braceletsStart + offset) % localizedBracelets.length;
      return localizedBracelets[index];
    });
  }, [braceletsStart, localizedBracelets]);

  const visibleNecklaces = useMemo(() => {
    if (localizedNecklaces.length <= ITEMS_PER_VIEW) {
      return localizedNecklaces;
    }
    return Array.from({ length: ITEMS_PER_VIEW }, (_, offset) => {
      const index = (necklacesStart + offset) % localizedNecklaces.length;
      return localizedNecklaces[index];
    });
  }, [localizedNecklaces, necklacesStart]);

  const showPrevBracelets = () => {
    setBraceletsStart((prev) => (prev - ITEMS_PER_VIEW + localizedBracelets.length) % localizedBracelets.length);
  };

  const showNextBracelets = () => {
    setBraceletsStart((prev) => (prev + ITEMS_PER_VIEW) % localizedBracelets.length);
  };

  const showPrevNecklaces = () => {
    setNecklacesStart((prev) => (prev - ITEMS_PER_VIEW + localizedNecklaces.length) % localizedNecklaces.length);
  };

  const showNextNecklaces = () => {
    setNecklacesStart((prev) => (prev + ITEMS_PER_VIEW) % localizedNecklaces.length);
  };

  const {
    cart,
    cartOpen,
    setCartOpen,
    cartCount,
    subtotalLabel,
    shippingLabel,
    shippingHint,
    cartTotalLabel,
    checkoutState,
    checkoutLoading,
    checkoutStatusText,
    checkoutError,
    lastRemovedItem,
    decrementQuantity,
    incrementQuantity,
    addToCart,
    removeFromCart,
    undoRemoveFromCart,
    startCheckout,
  } = useCart();

  return (
    <>
      <Head>
        <title>{t.metaHomeTitle}</title>
        <meta name="description" content={t.metaHomeDescription} />
      </Head>

      <main className={styles.page}>
        <header className={styles.brandHeader}>
          <Link className={styles.brandMark} href="/" aria-label={t.brandHomeAria}>
            SAIREN
          </Link>
          <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}>
            <span className={styles.cartIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label={t.shoppingBagIconAria}>
                <path d="M7 8V7a5 5 0 0110 0v1h2a1 1 0 011 1l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 9a1 1 0 011-1h2zm2 0h6V7a3 3 0 00-6 0v1zm-2.98 2l.87 8.72a.5.5 0 00.5.48h9.22a.5.5 0 00.5-.48L18 10H6.02z" />
              </svg>
            </span>
            <span className={styles.cartCount}>{cartCount}</span>
          </button>
        </header>

        {cartOpen ? (
          <aside className={styles.cartDrawer} aria-label={t.shoppingCartAria}>
            <div className={styles.cartHeader}>
              <h2>{t.yourBag}</h2>
              <button type="button" onClick={() => setCartOpen(false)}>
                {t.close}
              </button>
            </div>

            {cart.length === 0 ? (
              <p className={styles.cartEmpty}>{t.bagEmpty}</p>
            ) : (
              <>
                <ul className={styles.cartList}>
                  {cart.map((item) => (
                    <li key={item.itemKey} className={styles.cartItem}>
                      <img src={item.image} alt={item.name} />
                      <div className={styles.cartItemContent}>
                        <strong>{item.name}</strong>
                        <p>{item.priceLabel}</p>
                        <div className={styles.quantityControls}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => decrementQuantity(item.itemKey)}
                            aria-label={withVars(t.decreaseQuantity, { name: item.name })}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => incrementQuantity(item.itemKey)}
                            aria-label={withVars(t.increaseQuantity, { name: item.name })}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className={styles.removeItemBtn}
                        type="button"
                        onClick={() => removeFromCart(item.itemKey)}
                      >
                        {t.remove}
                      </button>
                    </li>
                  ))}
                </ul>
                {lastRemovedItem ? (
                  <div className={styles.undoBanner}>
                    <span>{withVars(t.removedItem, { name: lastRemovedItem.name })}</span>
                    <button type="button" onClick={undoRemoveFromCart}>
                      {t.undo}
                    </button>
                  </div>
                ) : null}
                <div className={styles.cartFooter}>
                  <div className={styles.cartRow}>
                    <span>{t.subtotal}</span>
                    <strong>{subtotalLabel}</strong>
                  </div>
                  <div className={styles.cartRow}>
                    <span>{t.shipping}</span>
                    <strong>{shippingLabel}</strong>
                  </div>
                  <p className={styles.shippingHint}>{shippingHint}</p>
                  <div className={styles.cartRowTotal}>
                    <span>{t.total}</span>
                    <strong>{cartTotalLabel}</strong>
                  </div>
                  <button type="button" onClick={startCheckout} disabled={checkoutLoading}>
                    {checkoutState === 'creating'
                      ? t.creatingSessionShort
                      : checkoutState === 'redirecting'
                        ? t.redirectingShort
                        : t.checkout}
                  </button>
                  {checkoutStatusText ? (
                    <span className={styles.checkoutStatus}>{checkoutStatusText}</span>
                  ) : null}
                  {checkoutError ? <span className={styles.checkoutError}>{checkoutError}</span> : null}
                </div>
              </>
            )}
          </aside>
        ) : null}

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{t.heroEyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroDescription}</p>
            <div className={styles.heroActions}>
              <Link href="/bracelets">{t.shopBracelets}</Link>
              <Link href="/necklaces" className={styles.ghostBtn}>
                {t.shopNecklaces}
              </Link>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <p>{t.heroPanelOne}</p>
            <p>{t.heroPanelTwo}</p>
            <p>{t.heroPanelThree}</p>
          </div>
        </section>

        <section className={styles.categoryStrip}>
          <article>
            <h2>
              <Link href="/bracelets" className={styles.categoryLink}>{t.bracelets}</Link>
            </h2>
            <p>{t.categoryBraceletsDesc}</p>
          </article>
          <article>
            <h2>
              <Link href="/necklaces" className={styles.categoryLink}>{t.necklaces}</Link>
            </h2>
            <p>{t.categoryNecklacesDesc}</p>
          </article>
        </section>

        <section id="bracelets" className={styles.collectionSection}>
          <header className={styles.collectionHeader}>
            <div className={styles.collectionHeading}>
              <span>{t.collection01}</span>
              <h2>
                <Link href="/bracelets" className={styles.categoryLink}>{t.bracelets}</Link>
              </h2>
            </div>
          </header>
          <div className={styles.collectionCarousel}>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
              type="button"
              onClick={showPrevBracelets}
              aria-label={t.showPrevBracelets}
              disabled={localizedBracelets.length <= ITEMS_PER_VIEW}
            >
              ‹
            </button>
            <div className={styles.productGrid}>
              {visibleBracelets.map((product, index) => (
                <ProductCard
                  key={`${product.slug}-${index}`}
                  product={product}
                  index={index}
                  onAdd={addToCart}
                  addLabel={t.addToBag}
                />
              ))}
            </div>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              type="button"
              onClick={showNextBracelets}
              aria-label={t.showNextBracelets}
              disabled={localizedBracelets.length <= ITEMS_PER_VIEW}
            >
              ›
            </button>
          </div>
        </section>

        <section id="necklaces" className={styles.collectionSection}>
          <header className={styles.collectionHeader}>
            <div className={styles.collectionHeading}>
              <span>{t.collection02}</span>
              <h2>
                <Link href="/necklaces" className={styles.categoryLink}>{t.necklaces}</Link>
              </h2>
            </div>
          </header>
          <div className={styles.collectionCarousel}>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
              type="button"
              onClick={showPrevNecklaces}
              aria-label={t.showPrevNecklaces}
              disabled={localizedNecklaces.length <= ITEMS_PER_VIEW}
            >
              ‹
            </button>
            <div className={styles.productGrid}>
              {visibleNecklaces.map((product, index) => (
                <ProductCard
                  key={`${product.slug}-${index}`}
                  product={product}
                  index={index}
                  onAdd={addToCart}
                  addLabel={t.addToBag}
                />
              ))}
            </div>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              type="button"
              onClick={showNextNecklaces}
              aria-label={t.showNextNecklaces}
              disabled={localizedNecklaces.length <= ITEMS_PER_VIEW}
            >
              ›
            </button>
          </div>
        </section>

        <footer className={styles.siteFooter}>
          <span className={styles.footerBrand}>© 2026 SAIREN</span>

          <a className={styles.footerEmail} href="mailto:info@sairen.lt">
            info@sairen.lt
          </a>

          <div className={styles.footerSocials}>
            <a
              href="https://www.facebook.com/sairen.lt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SAIREN on Facebook"
              className={styles.socialLink}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/sairen.lt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SAIREN on Instagram"
              className={styles.socialLink}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@sairen.lt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SAIREN on TikTok"
              className={styles.socialLink}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}