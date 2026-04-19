"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2, X } from "lucide-react";
import type { CartItem } from "@/types";

type CartPreviewProps = {
    cart: CartItem[];
    onRemove: (index: number) => void;
    title: string;
    totalLabel: string;
    checkoutLabel: string;
    boxLabel: (count: number) => string;
};

export default function CartPreview({
    cart,
    onRemove,
    title,
    totalLabel,
    checkoutLabel,
    boxLabel,
}: CartPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = cart.length;
    const totalPrice = useMemo(
        () => cart.reduce((sum, item) => sum + item.totalPrice, 0),
        [cart],
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-[var(--primary)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--primary-hover)] transition-all"
                aria-label="Open cart"
            >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[var(--danger)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/30"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--bg-card)] z-50 shadow-xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {title} ({totalItems})
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-[var(--bg-muted)]"
                                    aria-label="Close cart"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map((item, index) => (
                                    <div key={`${item.productId}-${index}`} className="bg-[var(--bg-muted)] rounded-xl p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-medium text-[var(--text-primary)]">
                                                    {boxLabel(item.boxSize)}
                                                </div>
                                                <div className="text-sm text-[var(--text-secondary)]">
                                                    {item.selections
                                                        .map((selection) => `${selection.productName} (${selection.count})`)
                                                        .join(" + ")}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemove(index)}
                                                className="p-1 text-[var(--text-muted)] hover:text-[var(--danger)]"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-right font-bold text-[var(--primary)]">
                                            {item.totalPrice.toFixed(3)} TND
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 border-t border-[var(--border)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[var(--text-secondary)]">{totalLabel}</span>
                                        <span className="text-xl font-bold text-[var(--text-primary)]">
                                            {totalPrice.toFixed(3)} TND
                                        </span>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        className="w-full py-3 rounded-xl font-semibold text-white text-center block transition-all"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                                        }}
                                    >
                                        {checkoutLabel}
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}