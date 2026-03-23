import { createContext, useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getItemKey } from '../data/products';
import { getTranslations, withVars } from '../lib/i18n';

const CartContext = createContext(null);

const getFallbackVariant = (product, cart) => {
  if (!product?.variants?.length) return null;
  return (
    product.variants.find((variant) => {
      const key = getItemKey(product.slug, variant.sku);
      const inCartQty = cart.find((item) => item.itemKey === key)?.quantity || 0;
      return inCartQty < variant.stock;
    }) || null
  );
};

export function CartProvider({ children }) {
  const { locale } = useRouter();
  const t = useMemo(() => getTranslations(locale || 'lt'), [locale]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle');
  const [checkoutError, setCheckoutError] = useState('');
  const [lastRemovedItem, setLastRemovedItem] = useState(null);

  const formatEuro = (valueCents) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'lt-LT', {
      style: 'currency',
      currency: 'EUR',
    }).format(valueCents / 100);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotalCents = useMemo(
    () => cart.reduce((total, item) => total + item.priceCents * item.quantity, 0),
    [cart]
  );
  const shippingCents = useMemo(() => {
    if (subtotalCents === 0) return 0;
    return subtotalCents >= 15000 ? 0 : 690;
  }, [subtotalCents]);
  const cartTotalCents = subtotalCents + shippingCents;
  const subtotalLabel = useMemo(() => formatEuro(subtotalCents), [subtotalCents, locale]);
  const shippingLabel = useMemo(
    () => (shippingCents === 0 ? t.free : formatEuro(shippingCents)),
    [shippingCents, t]
  );
  const cartTotalLabel = useMemo(() => formatEuro(cartTotalCents), [cartTotalCents, locale]);
  const shippingHint =
    subtotalCents >= 15000
      ? t.freeShippingUnlocked
      : withVars(t.addMoreForFreeShipping, { amount: formatEuro(15000 - subtotalCents) });

  const checkoutLoading = checkoutState === 'creating' || checkoutState === 'redirecting';
  const checkoutStatusText =
    checkoutState === 'creating'
      ? t.checkoutStatusCreating
      : checkoutState === 'redirecting'
        ? t.checkoutStatusRedirecting
        : '';

  const addToCart = (product, selectedVariant = null) => {
    setCart((prev) => {
      const variant = selectedVariant || getFallbackVariant(product, prev);
      if (!variant) {
        return prev;
      }

      const itemKey = getItemKey(product.slug, variant.sku);
      const existing = prev.find((item) => item.itemKey === itemKey);
      if (existing && existing.quantity < variant.stock) {
        return prev.map((item) =>
          item.itemKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      if (existing && existing.quantity >= variant.stock) {
        return prev;
      }

      return [
        ...prev,
        {
          ...product,
          itemKey,
          variant,
          quantity: 1,
        },
      ];
    });
    setLastRemovedItem(null);
    setCheckoutError('');
    setCheckoutState('idle');
    setCartOpen(true);
  };

  const updateQuantity = (itemKey, nextQuantity) => {
    if (nextQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.itemKey !== itemKey) return item;
        const maxStock = item.variant?.stock ?? nextQuantity;
        const cappedQuantity = Math.min(nextQuantity, maxStock);
        return { ...item, quantity: cappedQuantity };
      })
    );
    setCheckoutError('');
    setCheckoutState('idle');
  };

  const incrementQuantity = (itemKey) => {
    const item = cart.find((entry) => entry.itemKey === itemKey);
    if (!item) return;
    updateQuantity(itemKey, item.quantity + 1);
  };

  const decrementQuantity = (itemKey) => {
    const item = cart.find((entry) => entry.itemKey === itemKey);
    if (!item) return;
    updateQuantity(itemKey, item.quantity - 1);
  };

  const removeFromCart = (itemKey) => {
    setCart((prev) => {
      const removed = prev.find((item) => item.itemKey === itemKey) || null;
      if (removed) {
        setLastRemovedItem(removed);
      }
      return prev.filter((item) => item.itemKey !== itemKey);
    });
    setCheckoutError('');
    setCheckoutState('idle');
  };

  const undoRemoveFromCart = () => {
    if (!lastRemovedItem) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.itemKey === lastRemovedItem.itemKey);
      const maxStock = lastRemovedItem.variant?.stock || lastRemovedItem.quantity;
      if (existing) {
        return prev.map((item) =>
          item.itemKey === lastRemovedItem.itemKey
            ? {
                ...item,
                quantity: Math.min(item.quantity + lastRemovedItem.quantity, maxStock),
              }
            : item
        );
      }
      return [...prev, lastRemovedItem];
    });
    setLastRemovedItem(null);
    setCheckoutError('');
    setCheckoutState('idle');
  };

  const startCheckout = async () => {
    if (cart.length === 0 || checkoutLoading) return;

    setCheckoutError('');
    setCheckoutState('creating');

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
        throw new Error(payload.error || t.unableToStartCheckout);
      }

      setCheckoutState('redirecting');
      window.location.href = payload.url;
    } catch (error) {
      setCheckoutError(error.message || t.checkoutFailed);
      setCheckoutState('error');
    }
  };

  const clearCheckoutState = () => {
    setCheckoutError('');
    setCheckoutState('idle');
  };

  return (
    <CartContext.Provider
      value={{
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
        clearCheckoutState,
        lastRemovedItem,
        addToCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        undoRemoveFromCart,
        startCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
