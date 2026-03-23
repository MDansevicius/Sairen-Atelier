import Head from 'next/head';
import styles from '../styles/Home.module.css';

const bracelets = [
  {
    name: 'Starlit Cuff',
    price: 'EUR 119',
    material: 'Gold-plated brass',
    image:
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Velvet Chain Bracelet',
    price: 'EUR 89',
    material: 'Sterling silver',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Northern Charm Stack',
    price: 'EUR 149',
    material: '14k rose finish',
    image:
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80',
  },
];

const necklaces = [
  {
    name: 'Moonline Pendant',
    price: 'EUR 129',
    material: 'Silver and moonstone',
    image:
      'https://images.unsplash.com/photo-1599643478518-17488fbbcd77?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Aurora Drop Chain',
    price: 'EUR 109',
    material: 'Gold vermeil',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Halo Pearl Thread',
    price: 'EUR 159',
    material: 'Freshwater pearl',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
  },
];

function ProductCard({ product, index }) {
  return (
    <article className={styles.productCard} style={{ animationDelay: `${index * 90}ms` }}>
      <img className={styles.productImage} src={product.image} alt={product.name} />
      <div className={styles.productBody}>
        <h3>{product.name}</h3>
        <p>{product.material}</p>
        <div className={styles.productMeta}>
          <strong>{product.price}</strong>
          <button type="button">Add to Bag</button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
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
              <ProductCard key={product.name} product={product} index={index} />
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
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}