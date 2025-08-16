// src/contexts/QuotationContext.tsx
'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/payload-types'

export interface QuotationItem {
  product: Product
  quantity: number
  customRequirements?: string
}

interface QuotationState {
  items: QuotationItem[]
  isOpen: boolean
}

type QuotationAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'UPDATE_REQUIREMENTS'; payload: { productId: string; requirements: string } }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'TOGGLE_MODAL' }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }

const quotationReducer = (state: QuotationState, action: QuotationAction): QuotationState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id,
      )

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (action.payload.quantity || 1),
        }
        return { ...state, items: updatedItems }
      } else {
        // Add new item
        return {
          ...state,
          items: [
            ...state.items,
            {
              product: action.payload.product,
              quantity: action.payload.quantity || 1,
            },
          ],
        }
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }

    case 'UPDATE_REQUIREMENTS':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, customRequirements: action.payload.requirements }
            : item,
        ),
      }

    case 'CLEAR_ITEMS':
      return { ...state, items: [] }

    case 'TOGGLE_MODAL':
      return { ...state, isOpen: !state.isOpen }

    case 'SET_MODAL_OPEN':
      return { ...state, isOpen: action.payload }

    default:
      return state
  }
}

interface QuotationContextType {
  state: QuotationState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateRequirements: (productId: string, requirements: string) => void
  clearItems: () => void
  toggleModal: () => void
  setModalOpen: (open: boolean) => void
  totalItems: number
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined)

interface QuotationProviderProps {
  children: ReactNode
}

export const QuotationProvider: React.FC<QuotationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(quotationReducer, {
    items: [],
    isOpen: false,
  })

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
    }
  }

  const updateRequirements = (productId: string, requirements: string) => {
    dispatch({ type: 'UPDATE_REQUIREMENTS', payload: { productId, requirements } })
  }

  const clearItems = () => {
    dispatch({ type: 'CLEAR_ITEMS' })
  }

  const toggleModal = () => {
    dispatch({ type: 'TOGGLE_MODAL' })
  }

  const setModalOpen = (open: boolean) => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: open })
  }

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)

  const value: QuotationContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateRequirements,
    clearItems,
    toggleModal,
    setModalOpen,
    totalItems,
  }

  return <QuotationContext.Provider value={value}>{children}</QuotationContext.Provider>
}

export const useQuotation = (): QuotationContextType => {
  const context = useContext(QuotationContext)
  if (!context) {
    throw new Error('useQuotation must be used within a QuotationProvider')
  }
  return context
}
