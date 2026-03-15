import type { Cart } from '../types/cart.js';

export function getTotalItems(cart: Cart): number {
    return cart.reduce((sum, i) => sum + i.quantity, 0);
}

export function getTotalPrice(cart: Cart): number {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}