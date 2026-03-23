import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from '../context/CartContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <LanguageSwitcher />
      <Component {...pageProps} />
    </CartProvider>
  );
}
