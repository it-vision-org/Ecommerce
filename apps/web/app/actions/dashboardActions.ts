"use server";

import { db } from "@monkeyprint/db";
import { OrderStatus } from "@monkeyprint/db";

// ──────────────────────────────────────────────
// Dashboard Statistics
// ──────────────────────────────────────────────

export type DashboardStats = {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    pendingOrders: number;
    unreadContacts: number;
    activeProducts: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const [
            totalOrders,
            orders,
            totalProducts,
            totalUsers,
            totalCategories,
            pendingOrders,
            unreadContacts,
            activeProducts,
        ] = await Promise.all([
            db.order.count(),
            db.order.findMany({
                select: { total: true },
            }),
            db.product.count(),
            db.user.count(),
            db.category.count(),
            db.order.count({
                where: { status: OrderStatus.PENDING },
            }),
            db.contactSubmission.count({
                where: { isRead: false },
            }),
            db.product.count({
                where: { isActive: true },
            }),
        ]);

        const totalRevenue = orders.reduce(
            (sum, order) => sum + Number(order.total),
            0
        );

        return {
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers,
            totalCategories,
            pendingOrders,
            unreadContacts,
            activeProducts,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalOrders: 0,
            totalRevenue: 0,
            totalProducts: 0,
            totalUsers: 0,
            totalCategories: 0,
            pendingOrders: 0,
            unreadContacts: 0,
            activeProducts: 0,
        };
    }
}

// ──────────────────────────────────────────────
// Recent Orders
// ──────────────────────────────────────────────

export type RecentOrder = {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    customerName: string;
    total: number;
    createdAt: string;
};

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
    try {
        const orders = await db.order.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                orderNumber: true,
                status: true,
                customerName: true,
                total: true,
                createdAt: true,
            },
        });

        return orders.map((order) => ({
            ...order,
            total: Number(order.total),
            createdAt: order.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// Order Status Breakdown
// ──────────────────────────────────────────────

export type OrderStatusCount = {
    status: OrderStatus;
    count: number;
};

export async function getOrderStatusBreakdown(): Promise<OrderStatusCount[]> {
    try {
        const statusCounts = await db.order.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        return statusCounts.map((item) => ({
            status: item.status,
            count: item._count.status,
        }));
    } catch (error) {
        console.error("Error fetching order status breakdown:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// Low Stock Products
// ──────────────────────────────────────────────

export type LowStockProduct = {
    id: string;
    name: string;
    stock: number;
    category: string;
};

export async function getLowStockProducts(
    threshold = 10
): Promise<LowStockProduct[]> {
    try {
        const products = await db.product.findMany({
            where: {
                stock: {
                    lte: threshold,
                },
                isActive: true,
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                stock: "asc",
            },
            take: 5,
        });

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
            category: product.category.name,
        }));
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// Recent Contact Submissions
// ──────────────────────────────────────────────

export type RecentContact = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    isRead: boolean;
    createdAt: string;
};

export async function getRecentContacts(limit = 5): Promise<RecentContact[]> {
    try {
        const contacts = await db.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                subject: true,
                isRead: true,
                createdAt: true,
            },
        });

        return contacts.map((contact) => ({
            ...contact,
            createdAt: contact.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching recent contacts:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// Revenue by Day (Last 7 Days)
// ──────────────────────────────────────────────

export type DailyRevenue = {
    date: string;
    revenue: number;
};

export async function getRevenueByDay(days = 7): Promise<DailyRevenue[]> {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await db.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
                status: {
                    not: OrderStatus.CANCELLED,
                },
            },
            select: {
                total: true,
                createdAt: true,
            },
        });

        // Group by date
        const revenueMap = new Map<string, number>();

        orders.forEach((order) => {
            const date = order.createdAt.toISOString().split("T")[0];
            const current = revenueMap.get(date) || 0;
            revenueMap.set(date, current + Number(order.total));
        });

        // Fill in missing dates with 0
        const result: DailyRevenue[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            result.push({
                date: dateStr,
                revenue: revenueMap.get(dateStr) || 0,
            });
        }

        return result;
    } catch (error) {
        console.error("Error fetching revenue by day:", error);
        return [];
    }
}