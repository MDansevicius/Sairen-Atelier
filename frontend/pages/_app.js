import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from '../context/CartContext';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
