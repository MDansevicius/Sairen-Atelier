import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartTotalLabel = useMemo(() => {
    const totalCents = cart.reduce(
      (total, item) => total + item.priceCents * item.quantity,
      0
    );
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
    if (cart.length === 0 || checkoutLoading) return;

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
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
