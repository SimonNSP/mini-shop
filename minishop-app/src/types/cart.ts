import { z } from 'zod';

export const CartItemSchema = z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
});

export const CartSchema = z.array(CartItemSchema);

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;