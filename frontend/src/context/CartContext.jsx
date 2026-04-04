import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('atv_cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('atv_cart', JSON.stringify(items))
  }, [items])

  const addItem = (jersey, size, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === jersey.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.id === jersey.id && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, {
        id: jersey.id, slug: jersey.slug,
        title: jersey.title, club: jersey.club,
        price: jersey.price, size, qty,
        image: jersey.images?.[0] || null,
      }]
    })
  }

  const removeItem = (id, size) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }

  const updateQty = (id, size, qty) => {
    if (qty < 1) { removeItem(id, size); return }
    setItems(prev => prev.map(i =>
      i.id === id && i.size === size ? { ...i, qty } : i
    ))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)