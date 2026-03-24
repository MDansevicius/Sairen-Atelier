import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { necklaces } from '../data/products';
import { useCart } from '../context/CartContext';
import { getTranslations, withVars } from '../lib/i18n';
import { localizeProducts } from '../lib/productLocalization';

function LangButton() {
  const { locale, pathname, query, push } = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (loc) => { setOpen(false); if (loc !== locale) push({ pathname, query }, undefined, { locale: loc }); };

  return (
    <div ref={ref} className={styles.langWrap}>
      <button type="button" className={styles.langButton} onClick={() => setOpen(!open)}>
        {locale === 'lt' ? 'LT' : 'EN'} <span className={open ? styles.chevronOpen : styles.chevron}>▾</span>
      </button>
      {open && (
        <div className={styles.langMenu}>
          <button type="button" className={locale === 'lt' ? styles.langOptionActive : styles.langOption} onClick={() => pick('lt')}>LT</button>
          <button type="button" className={locale === 'en' ? styles.langOptionActive : styles.langOption} onClick={() => pick('en')}>EN</button>
        </div>
      )}
    </div>
  );
}

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

export default function NecklacesPage() {
  const { locale } = useRouter();
  const t = getTranslations(locale || 'lt');
  const localizedNecklaces = useMemo(
    () => localizeProducts(necklaces, locale || 'lt'),
    [locale]
  );
  const maxCatalogPrice = useMemo(
    () => Math.max(...localizedNecklaces.map((product) => Math.round(product.priceCents / 100))),
    [localizedNecklaces]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxCatalogPrice);

  const materialOptions = useMemo(
    () => ['all', ...new Set(localizedNecklaces.map((product) => product.material))],
    [localizedNecklaces]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return localizedNecklaces.filter((product) => {
      const matchesPrice = product.priceCents <= maxPriceFilter * 100;
      const matchesMaterial = materialFilter === 'all' || product.material === materialFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.material.toLowerCase().includes(normalizedSearch);

      return matchesPrice && matchesMaterial && matchesSearch;
    });
  }, [localizedNecklaces, materialFilter, maxPriceFilter, searchTerm]);

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
        <title>{t.metaNecklacesTitle}</title>
        <meta name="description" content={t.metaNecklacesDescription} />
      </Head>

      <main className={styles.page}>
        <header className={styles.brandHeader}>
          <Link className={styles.brandMark} href="/" aria-label={t.brandHomeAria}>
            SAIREN
          </Link>
          <div className={styles.headerRight}>
            <LangButton />
            <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}>
            <span className={styles.cartIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label={t.shoppingBagIconAria}>
                <path d="M7 8V7a5 5 0 0110 0v1h2a1 1 0 011 1l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 9a1 1 0 011-1h2zm2 0h6V7a3 3 0 00-6 0v1zm-2.98 2l.87 8.72a.5.5 0 00.5.48h9.22a.5.5 0 00.5-.48L18 10H6.02z" />
              </svg>
            </span>
            <span className={styles.cartCount}>{cartCount}</span>
            </button>
          </div>
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

        <section className={styles.collectionSection}>
          <header className={styles.collectionHeader}>
            <span>{t.collectionLabel}</span>
            <h2>{t.necklaces}</h2>
          </header>

          <section className={styles.filterBar} aria-label={t.filtersAriaNecklaces}>
            <div className={styles.filterPrice}>
              <label htmlFor="necklaces-search">{t.search}</label>
              <div className={styles.filterPriceRow}>
                <input
                  id="necklaces-search"
                  type="text"
                  placeholder={t.searchByNameOrMaterial}
                  className={styles.filterTextInput}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterType}>
              <span>{t.material}</span>
              <div>
                {materialOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={materialFilter === option ? styles.filterChipActive : styles.filterChip}
                    onClick={() => setMaterialFilter(option)}
                  >
                    {option === 'all' ? t.all : option}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterPrice}>
              <label htmlFor="necklaces-price-filter">{t.priceUpTo}</label>
              <div className={styles.filterPriceRow}>
                <input
                  id="necklaces-price-filter"
                  type="range"
                  min="80"
                  max={maxCatalogPrice}
                  step="5"
                  value={maxPriceFilter}
                  onChange={(event) => setMaxPriceFilter(Number(event.target.value))}
                />
                <strong>EUR {maxPriceFilter}</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSearchTerm('');
                setMaterialFilter('all');
                setMaxPriceFilter(maxCatalogPrice);
              }}
            >
              {t.clearFilters}
            </button>
          </section>

          {filteredProducts.length === 0 ? (
            <section className={styles.emptyResult}>
              <h3>{t.noNecklacesMatch}</h3>
              <p>{t.broadenFiltersHint}</p>
            </section>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  index={index}
                  onAdd={addToCart}
                  addLabel={t.addToBag}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
