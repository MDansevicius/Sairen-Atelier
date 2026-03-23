import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <Container className={styles.container}>
      <Row>
        <Col md={8} offsetMd={2}>
          <h1 className={styles.title}>Welcome to SAIREN Jewelry</h1>
          <p className={styles.description}>Explore our exquisite collection of bracelets and necklaces.</p>
        </Col>
      </Row>
      <Row className={styles.products}>
        {/* Bracelet */}
        <Col md={4} sm={6} xs={12}>
          <div className={styles.productCard}>
            <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0" alt="Crystal Wish Bracelet" />
            <h3>Crystal Wish Bracelet</h3>
            <p>Elegant crystal-encrusted bracelet with sterling silver clasp</p>
            <button className={styles.button}>Add to Cart</button>
          </div>
        </Col>

        {/* Necklace */}
        <Col md={4} sm={6} xs={12}>
          <div className={styles.productCard}>
            <img src="https://images.unsplash.com/photo-1599643478518-17488fbbcd77" alt="Moonstone Pendant Necklace" />
            <h3>Moonstone Pendant Necklace</h3>
            <p>Beautiful moonstone pendant on delicate silver chain</p>
            <button className={styles.button}>Add to Cart</button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;