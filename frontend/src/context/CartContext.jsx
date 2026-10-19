import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it._id === product._id);
      if (existing) {
        return prev.map((it) =>
          it._id === product._id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          image: product.image,
          seller: product.seller?._id || product.seller,
          sellerName: product.seller?.shopName || product.seller?.name || "",
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id) => setItems((p) => p.filter((it) => it._id !== id));
  const updateQuantity = (id, qty) =>
    setItems((p) =>
      p.map((it) => (it._id === id ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}