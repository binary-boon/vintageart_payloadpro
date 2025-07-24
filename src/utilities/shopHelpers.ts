export function formatPrice(price: number, currency = '₹'): string {
  return `${currency}${price.toLocaleString('en-IN')}`
}

export function formatDiscount(originalPrice: number, salePrice: number): string {
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  return `${discount}% OFF`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
