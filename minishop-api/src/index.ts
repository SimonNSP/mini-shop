import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import { z } from 'zod';

const app = express();
const PORT = 3000;

const CartItemSchema = z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
});

type CartItem = z.infer<typeof CartItemSchema>;

const carts = new Map<string, CartItem[]>();

app.use(express.json());
app.use(cookieParser());

function getOrCreateCart(req: express.Request, res: express.Response): string {
    let cartId = req.cookies.cartId;

    if (!cartId || !carts.has(cartId)) {
        cartId = crypto.randomUUID();
        carts.set(cartId, []);
        res.cookie('cartId', cartId, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    return cartId;
}

// Warenkorb abrufen
app.get('/cart', (req, res) => {
    const cartId = getOrCreateCart(req, res);
    res.json(carts.get(cartId));
});

// Artikel hinzufügen
app.post('/cart/items', (req, res) => {
    const cartId = getOrCreateCart(req, res);
    const cart = carts.get(cartId)!;

    const result = CartItemSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
    }

    const existing = cart.find(item => item.productId === result.data.productId);
    if (existing) {
        existing.quantity += result.data.quantity;
    } else {
        cart.push(result.data);
    }

    res.json(cart);
});

// Artikel entfernen
app.delete('/cart/items/:productId', (req, res) => {
    const cartId = getOrCreateCart(req, res);
    const cart = carts.get(cartId)!;

    const productId = Number(req.params.productId);
    if (isNaN(productId)) {
        res.status(400).json({ error: 'Ungültige productId' });
        return;
    }

    const filtered = cart.filter(i => i.productId !== productId);
    carts.set(cartId, filtered);
    res.json(filtered);
});

// Warenkorb leeren
app.delete('/cart', (req, res) => {
    const cartId = getOrCreateCart(req, res);
    carts.set(cartId, []);
    res.json([]);
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));