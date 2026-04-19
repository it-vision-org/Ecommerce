"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/types";
import { CART_STORAGE_KEY, parseStoredCart } from "@/lib/cart";

export function usePersistentCart(storageKey: string = CART_STORAGE_KEY) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartLoaded, setCartLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            setCart(parseStoredCart(raw));
        } catch {
            setCart([]);
        } finally {
            setCartLoaded(true);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!cartLoaded) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        } catch {
            // ignore localStorage write errors
        }
    }, [cart, cartLoaded, storageKey]);

    return { cart, setCart, cartLoaded };
}