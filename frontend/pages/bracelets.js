import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.css';
import { bracelets } from '../data/products';
import { useCart } from '../context/CartContext';

function ProductCard({ product, index, onAdd }) {
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
          <button type="button" onClick={() => onAdd(product)}>Add to Bag</button>
        </div>
      </div>
    </article>
  );
}

export default function BraceletsPage() {
  const maxCatalogPrice = useMemo(
    () => Math.max(...bracelets.map((product) => Math.round(product.priceCents / 100))),
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxCatalogPrice);

  const materialOptions = useMemo(
    () => ['all', ...new Set(bracelets.map((product) => product.material))],
    []
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return bracelets.filter((product) => {
      const matchesPrice = product.priceCents <= maxPriceFilter * 100;
      const matchesMaterial = materialFilter === 'all' || product.material === materialFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.material.toLowerCase().includes(normalizedSearch);

      return matchesPrice && matchesMaterial && matchesSearch;
    });
  }, [materialFilter, maxPriceFilter, searchTerm]);

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
        <title>Bracelets | SAIREN Jewelry</title>
        <meta name="description" content="Explore SAIREN bracelets with search and filter options." />
      </Head>

      <main className={styles.page}>
        <header className={styles.brandHeader}>
          <Link className={styles.brandMark} href="/" aria-label="SAIREN home">
            SAIREN
          </Link>
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
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => incrementQuantity(item.itemKey)}
                            aria-label={`Increase ${item.name} quantity`}
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
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                {lastRemovedItem ? (
                  <div className={styles.undoBanner}>
                    <span>Removed {lastRemovedItem.name}.</span>
                    <button type="button" onClick={undoRemoveFromCart}>
                      Undo
                    </button>
                  </div>
                ) : null}
                <div className={styles.cartFooter}>
                  <div className={styles.cartRow}>
                    <span>Subtotal</span>
                    <strong>{subtotalLabel}</strong>
                  </div>
                  <div className={styles.cartRow}>
                    <span>Shipping</span>
                    <strong>{shippingLabel}</strong>
                  </div>
                  <p className={styles.shippingHint}>{shippingHint}</p>
                  <div className={styles.cartRowTotal}>
                    <span>Total</span>
                    <strong>{cartTotalLabel}</strong>
                  </div>
                  <button type="button" onClick={startCheckout} disabled={checkoutLoading}>
                    {checkoutState === 'creating'
                      ? 'Creating session...'
                      : checkoutState === 'redirecting'
                        ? 'Redirecting...'
                        : 'Checkout'}
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
            <span>Collection</span>
            <h2>Bracelets</h2>
          </header>

          <section className={styles.filterBar} aria-label="Bracelets filters">
            <div className={styles.filterPrice}>
              <label htmlFor="bracelets-search">Search</label>
              <div className={styles.filterPriceRow}>
                <input
                  id="bracelets-search"
                  type="text"
                  placeholder="Search by name or material"
                  className={styles.filterTextInput}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterType}>
              <span>Material</span>
              <div>
                {materialOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={materialFilter === option ? styles.filterChipActive : styles.filterChip}
                    onClick={() => setMaterialFilter(option)}
                  >
                    {option === 'all' ? 'All' : option}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterPrice}>
              <label htmlFor="bracelets-price-filter">Price up to</label>
              <div className={styles.filterPriceRow}>
                <input
                  id="bracelets-price-filter"
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
              Clear filters
            </button>
          </section>

          {filteredProducts.length === 0 ? (
            <section className={styles.emptyResult}>
              <h3>No bracelets match your filters.</h3>
              <p>Try broadening material or increasing max price.</p>
            </section>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.name} product={product} index={index} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
