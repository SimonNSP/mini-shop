import { z } from 'zod';

export const ProductSchema = z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const PRODUCTS: Product[] = [
    { productId: 1, name: 'Mechanical Keyboard', price: 129.99, description: 'Tactile switches, RGB backlight' },
    { productId: 2, name: 'Wireless Mouse', price: 59.99, description: 'Ergonomic, 3000 DPI' },
    { productId: 3, name: 'USB-C Hub', price: 39.99, description: '7-in-1, 4K HDMI' },
    { productId: 4, name: 'Monitor Stand', price: 49.99, description: 'Adjustable height, cable management' },
    { productId: 5, name: 'Webcam HD', price: 89.99, description: '1080p, built-in microphone' },
    { productId: 6, name: 'Desk Mat', price: 24.99, description: 'XXL, non-slip base' },
];