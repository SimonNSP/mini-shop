import client from './client.js';
import { CartSchema, type Cart, type CartItem } from '../types/cart.js';

export async function getCart(): Promise<Cart> {
    const res = await client.get('/cart');
    return CartSchema.parse(res.data);
}

export async function addItem(item: Omit<CartItem, 'quantity'>): Promise<Cart> {
    const res = await client.post('/cart/items', { ...item, quantity: 1 });
    return CartSchema.parse(res.data);
}

export async function removeItem(productId: number): Promise<Cart> {
    const res = await client.delete(`/cart/items/${productId}`);
    return CartSchema.parse(res.data);
}

export async function clearCart(): Promise<Cart> {
    const res = await client.delete('/cart');
    return CartSchema.parse(res.data);
}