import type { BoxConfig, CartItem, CustomerType, SerializedProductWithCategory } from "@/types";

export const CART_STORAGE_KEY = "seefood_cart";
export const MAX_FLAVOURS = 2;

export const INDIVIDUAL_BOXES: readonly BoxConfig[] = [
    { pieces: 6, maxTypes: 2 },
    { pieces: 8, maxTypes: 2 },
    { pieces: 12, maxTypes: 2 },
];

export const RESTAURANT_BOXES: readonly BoxConfig[] = [
    { pieces: 300, maxTypes: 2 },
    { pieces: 600, maxTypes: 2 },
    { pieces: 900, maxTypes: 2 },
];

type ProductLookup = Record<string, Pick<SerializedProductWithCategory, "id" | "name">>;

export function getBoxesForCustomerType(
    isRestaurantUser: boolean,
    customerType: CustomerType,
): readonly BoxConfig[] {
    if (isRestaurantUser && customerType === "restaurant") return RESTAURANT_BOXES;
    return INDIVIDUAL_BOXES;
}

export function splitBoxCountEvenly(
    selectedBox: number | null,
    selectedProductIds: string[],
): Record<string, number> {
    if (selectedBox === null || selectedProductIds.length === 0) return {};

    if (selectedProductIds.length === 1) {
        return { [selectedProductIds[0]]: selectedBox };
    }

    const result: Record<string, number> = {};
    const baseCount = Math.floor(selectedBox / selectedProductIds.length);
    const remainder = selectedBox % selectedProductIds.length;

    selectedProductIds.forEach((id, index) => {
        result[id] = baseCount + (index < remainder ? 1 : 0);
    });

    return result;
}

export function buildSingleProductCartItem(params: {
    product: Pick<SerializedProductWithCategory, "id" | "name">;
    boxSize: number;
    unitPrice: number;
}): CartItem {
    const { product, boxSize, unitPrice } = params;

    return {
        productId: product.id,
        productName: product.name,
        boxSize,
        quantity: 1,
        selections: [{ productId: product.id, productName: product.name, count: boxSize }],
        unitPrice,
        totalPrice: unitPrice * boxSize,
    };
}

export function buildMixedSelectionCartItem(params: {
    selectedProductIds: string[];
    productsById: ProductLookup;
    boxSize: number;
    unitPrice: number;
    assignedCounts: Record<string, number>;
}): CartItem {
    const { selectedProductIds, productsById, boxSize, unitPrice, assignedCounts } = params;

    const selections = selectedProductIds.map((id) => {
        const product = productsById[id];
        return {
            productId: id,
            productName: product?.name ?? "",
            count: assignedCounts[id] ?? 0,
        };
    });

    return {
        productId: selections.map((s) => s.productId).join("-"),
        productName: selections.map((s) => `${s.productName} (${s.count})`).join(" + "),
        boxSize,
        quantity: 1,
        selections,
        unitPrice,
        totalPrice: unitPrice * boxSize,
    };
}

export function parseStoredCart(rawValue: string | null): CartItem[] {
    if (!rawValue) return [];

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isValidCartItem);
    } catch {
        return [];
    }
}

function isValidCartItem(value: unknown): value is CartItem {
    if (!value || typeof value !== "object") return false;
    const item = value as CartItem;

    return (
        typeof item.productId === "string" &&
        typeof item.productName === "string" &&
        typeof item.boxSize === "number" &&
        typeof item.quantity === "number" &&
        Array.isArray(item.selections) &&
        typeof item.unitPrice === "number" &&
        typeof item.totalPrice === "number"
    );
}