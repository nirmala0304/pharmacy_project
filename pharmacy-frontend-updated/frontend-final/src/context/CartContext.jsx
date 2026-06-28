import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 })
  const [cartCount, setCartCount] = useState(0)
  const { user } = useAuth()

  // Define fetchCart BEFORE useEffect that calls it (avoids hoisting issue with const)
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch {
      setCart({ items: [], totalAmount: 0 })
    }
  }

  useEffect(() => {
    if (user?.role === 'CUSTOMER') fetchCart()
    else setCart({ items: [], totalAmount: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    setCartCount(cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)
  }, [cart])

  const addToCart = async (medicineId, quantity = 1, prescriptionId = null) => {
    const res = await api.post('/cart/add', { medicineId, quantity, prescriptionId })
    setCart(res.data)
    return res.data
  }

  const updateQuantity = async (cartItemId, quantity) => {
    // Guard: quantity must be at least 1; use removeItem if it reaches 0
    if (quantity < 1) return
    const res = await api.put(`/cart/item/${cartItemId}`, { quantity })
    setCart(res.data)
  }

  const removeItem = async (cartItemId) => {
    const res = await api.delete(`/cart/item/${cartItemId}`)
    setCart(res.data)
  }

  const clearCart = async () => {
    await api.delete('/cart/clear')
    setCart({ items: [], totalAmount: 0 })
  }

  const applyCoupon = async (code) => {
    const res = await api.post('/cart/coupon', { code })
    setCart(res.data)
    return res.data
  }

  const removeCoupon = async () => {
    const res = await api.delete('/cart/coupon')
    setCart(res.data)
    return res.data
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
