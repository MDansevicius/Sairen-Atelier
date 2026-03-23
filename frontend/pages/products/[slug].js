import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/Product.module.css';
import homeStyles from '../../styles/Home.module.css';
import { allProducts } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { getTranslations, translateCategory, withVars } from '../../lib/i18n';
import { localizeProduct } from '../../lib/productLocalization';

export async function getStaticPaths({ locales }) {
  return {
    paths: allProducts.flatMap((p) =>
      (locales || ['lt', 'en']).map((locale) => ({
        params: { slug: p.slug },
        locale,
      }))
    ),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = allProducts.find((p) => p.slug === params.slug) || null;
  return { props: { product } };
}

export default function ProductPage({ product }) {
  const { locale } = useRouter();
  const t = getTranslations(locale || 'lt');
  const localizedProduct = localizeProduct(product, locale || 'lt');
  const [activeImage, setActiveImage] = useState(0);

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
    addToCart,
    decrementQuantity,
    incrementQuantity,
    removeFromCart,
    undoRemoveFromCart,
    startCheckout,
  } = useCart();

  if (!localizedProduct) return null;

  return (
    <>
      <Head>
        <title>{`${localizedProduct.name} - ${t.metaProductTitleSuffix}`}</title>
        <meta name="description" content={localizedProduct.description} />
      </Head>

      <main className={styles.page}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← {t.backToShop}
          </Link>
          <Link className={styles.brandMark} href="/" aria-label={t.brandHomeAria}>
            SAIREN
          </Link>
          <button
            className={styles.cartButton}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={t.openShoppingBag}
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
          <aside className={homeStyles.cartDrawer} aria-label={t.shoppingCartAria}>
            <div className={homeStyles.cartHeader}>
              <h2>{t.yourBag}</h2>
              <button type="button" onClick={() => setCartOpen(false)}>{t.close}</button>
            </div>
            {cart.length === 0 ? (
              <p className={homeStyles.cartEmpty}>{t.bagEmpty}</p>
            ) : (
              <>
                <ul className={homeStyles.cartList}>
                  {cart.map((item) => (
                    <li key={item.itemKey} className={homeStyles.cartItem}>
                      <img src={item.image} alt={item.name} />
                      <div className={homeStyles.cartItemContent}>
                        <strong>{item.name}</strong>
                        <p>{item.priceLabel}</p>
                        <div className={homeStyles.quantityControls}>
                          <button
                            type="button"
                            className={homeStyles.qtyBtn}
                            onClick={() => decrementQuantity(item.itemKey)}
                            aria-label={withVars(t.decreaseQuantity, { name: item.name })}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className={homeStyles.qtyBtn}
                            onClick={() => incrementQuantity(item.itemKey)}
                            aria-label={withVars(t.increaseQuantity, { name: item.name })}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={homeStyles.removeItemBtn}
                        onClick={() => removeFromCart(item.itemKey)}
                      >
                        {t.remove}
                      </button>
                    </li>
                  ))}
                </ul>
                {lastRemovedItem ? (
                  <div className={homeStyles.undoBanner}>
                    <span>{withVars(t.removedItem, { name: lastRemovedItem.name })}</span>
                    <button type="button" onClick={undoRemoveFromCart}>
                      {t.undo}
                    </button>
                  </div>
                ) : null}
                <div className={homeStyles.cartFooter}>
                  <div className={homeStyles.cartRow}>
                    <span>{t.subtotal}</span>
                    <strong>{subtotalLabel}</strong>
                  </div>
                  <div className={homeStyles.cartRow}>
                    <span>{t.shipping}</span>
                    <strong>{shippingLabel}</strong>
                  </div>
                  <p className={homeStyles.shippingHint}>{shippingHint}</p>
                  <div className={homeStyles.cartRowTotal}>
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
                    <span className={homeStyles.checkoutStatus}>{checkoutStatusText}</span>
                  ) : null}
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
              src={localizedProduct.gallery[activeImage]}
              alt={withVars(t.photoAlt, { name: localizedProduct.name, index: activeImage + 1 })}
            />
            <div className={styles.thumbnails}>
              {localizedProduct.gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={withVars(t.thumbAlt, { name: localizedProduct.name, index: i + 1 })}
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className={styles.details}>
            <p className={styles.breadcrumb}>
              <Link href="/">{t.home}</Link>
              {' / '}
              <Link href={localizedProduct.category === 'Bracelets' ? '/bracelets' : '/necklaces'}>
                {translateCategory(localizedProduct.category, t)}
              </Link>
              {' / '}
              {localizedProduct.name}
            </p>

            <h1 className={styles.productName}>{localizedProduct.name}</h1>
            <span className={styles.materialBadge}>{localizedProduct.material}</span>
            <p className={styles.price}>{localizedProduct.priceLabel}</p>
            <p className={styles.description}>{localizedProduct.description}</p>

            <button
              className={styles.addBtn}
              type="button"
              onClick={() => addToCart(localizedProduct)}
            >
              {t.addToBag}
            </button>

            <p className={styles.specsTitle}>{t.specifications}</p>
            <table className={styles.specs}>
              <tbody>
                {Object.entries(localizedProduct.specs).map(([key, value]) => (
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
