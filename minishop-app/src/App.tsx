import { useEffect, useState } from 'react';
import { getCart, addItem, removeItem, clearCart } from './api/cartApi.js';
import { getTotalItems, getTotalPrice } from './services/cartService.js';
import { PRODUCTS } from './types/product.js';
import type { Cart } from './types/cart.js';

export default function App() {
  const [cart, setCart] = useState<Cart>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  async function handleAddItem(productId: number, name: string, price: number) {
    setLoading(true);
    const updated = await addItem({ productId, name, price });
    setCart(updated);
    setLoading(false);
  }

  async function handleRemoveItem(productId: number) {
    const updated = await removeItem(productId);
    setCart(updated);
  }

  async function handleClearCart() {
    const updated = await clearCart();
    setCart(updated);
  }

  const totalItems = getTotalItems(cart);
  const totalPrice = getTotalPrice(cart);

  return (
      <div style={{ fontFamily: 'system-ui', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>minishop</h1>
          <button
              onClick={() => setCartOpen(!cartOpen)}
              style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 15 }}
          >
            🛒 Warenkorb {totalItems > 0 && `(${totalItems})`}
          </button>
        </header>

        <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>

          {/* Produktliste */}
          <main style={{ flex: 1 }}>
            <h2 style={{ marginTop: 0 }}>Produkte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {PRODUCTS.map(product => (
                  <div key={product.productId} style={{ border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>#{product.productId}</div>
                    <h3 style={{ margin: '0 0 6px' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 16px', color: '#555', fontSize: 14 }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 18 }}>€{product.price.toFixed(2)}</span>
                      <button
                          onClick={() => handleAddItem(product.productId, product.name, product.price)}
                          disabled={loading}
                          style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
                      >
                        + Hinzufügen
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </main>

          {/* Warenkorb Sidebar */}
          {cartOpen && (
              <aside style={{ width: 320, flexShrink: 0 }}>
                <h2 style={{ marginTop: 0 }}>Warenkorb</h2>
                {cart.length === 0 ? (
                    <p style={{ color: '#888' }}>Warenkorb ist leer.</p>
                ) : (
                    <>
                      {cart.map(item => (
                          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.name}</div>
                              <div style={{ fontSize: 13, color: '#888' }}>€{item.price.toFixed(2)} × {item.quantity}</div>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.productId)}
                                style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#e00' }}
                            >
                              ✕
                            </button>
                          </div>
                      ))}
                      <div style={{ marginTop: 16, fontWeight: 700, fontSize: 18 }}>
                        Gesamt: €{totalPrice.toFixed(2)}
                      </div>
                      <button
                          onClick={handleClearCart}
                          style={{ marginTop: 12, width: '100%', background: '#fff', color: '#e00', border: '1px solid #e00', borderRadius: 8, padding: '10px', cursor: 'pointer' }}
                      >
                        Warenkorb leeren
                      </button>
                    </>
                )}
              </aside>
          )}
        </div>
      </div>
  );
}