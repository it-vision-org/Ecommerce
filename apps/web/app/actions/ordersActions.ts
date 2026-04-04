"use server";

import { db, Prisma, OrderStatus, PaymentMethod } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type SerializedOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  items: SerializedOrderItem[];
};

export type SerializedOrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productImage: string | null;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  notes?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "BANK_TRANSFER";
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  userId?: string;
};

export type UpdateOrderInput = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  notes: string | null;
  shippingCost: number;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export type UpdateOrderStatusInput = {
  id: string;
  status: OrderStatus;
};

// ──────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────

function serializeOrder(order: OrderWithItems): SerializedOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    address: order.address,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    userId: order.userId,
    user: order.user
      ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      productName: item.productName,
      productImage: item.productImage,
      productId: item.productId,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        images: item.product.images,
      },
    })),
  };
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SF-${timestamp}-${random}`;
}

// ──────────────────────────────────────────────
// CREATE Order
// ──────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput) {
  try {
    // Calculate totals
    let subtotal = 0;
    const itemsData = input.items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        productId: item.productId,
        productName: item.productName,
        quantity: new Prisma.Decimal(item.quantity),
        unitPrice: new Prisma.Decimal(item.unitPrice),
        totalPrice: new Prisma.Decimal(totalPrice),
      };
    });

    // Free shipping over 100 TND
    const shippingCost = subtotal >= 100 ? 0 : 7;
    const total = subtotal + shippingCost;

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // Get product images for order items
    const productIds = input.items.map((item) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, images: true },
    });
    const productImageMap = new Map(
      products.map((p) => [p.id, p.images[0] || null]),
    );

    // Create order with items
    const order = await db.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        paymentMethod: input.paymentMethod,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        address: input.address,
        notes: input.notes || null,
        subtotal: new Prisma.Decimal(subtotal),
        shippingCost: new Prisma.Decimal(shippingCost),
        total: new Prisma.Decimal(total),
        userId: input.userId || null,
        items: {
          create: itemsData.map((item) => ({
            ...item,
            productImage: productImageMap.get(item.productId) || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard/orders");

    return { success: true, data: serializeOrder(order) };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

// ──────────────────────────────────────────────
// GET Orders (Admin)
// ──────────────────────────────────────────────

export async function getOrders(options?: {
  status?: OrderStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "total" | "orderNumber";
  sortOrder?: "asc" | "desc";
}) {
  try {
    const {
      status,
      search,
      limit = 50,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options || {};

    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      db.order.count({ where }),
    ]);

    return {
      success: true,
      data: orders.map(serializeOrder),
      total,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      data: [],
      total: 0,
      error: "Failed to fetch orders",
    };
  }
}

// ──────────────────────────────────────────────
// GET Orders by User
// ──────────────────────────────────────────────

export async function getOrdersByUser(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: orders.map(serializeOrder),
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, data: [], error: "Failed to fetch orders" };
  }
}

// ──────────────────────────────────────────────
// GET Order by ID
// ──────────────────────────────────────────────

export async function getOrderById(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, data: serializeOrder(order) };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

// ──────────────────────────────────────────────
// UPDATE Order (Full Edit)
// ──────────────────────────────────────────────

export async function updateOrder(input: UpdateOrderInput) {
  try {
    // Calculate new subtotal from items
    let subtotal = 0;
    const itemUpdates = input.items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        where: { id: item.id },
        data: {
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: totalPrice,
        },
      };
    });

    const total = subtotal + input.shippingCost;

    // Update order and items in a transaction
    const updatedOrder = await db.$transaction(async (tx) => {
      // Update all order items
      for (const update of itemUpdates) {
        await tx.orderItem.update(update);
      }

      // Update the order
      const order = await tx.order.update({
        where: { id: input.id },
        data: {
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          address: input.address,
          notes: input.notes,
          subtotal: subtotal,
          shippingCost: input.shippingCost,
          total: total,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return order;
    });

    return {
      success: true,
      data: serializeOrder(updatedOrder as OrderWithItems),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      error: "Failed to update order",
    };
  }
}

// ──────────────────────────────────────────────
// UPDATE Order Status
// ──────────────────────────────────────────────

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  try {
    const order = await db.order.update({
      where: { id: input.id },
      data: { status: input.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard/orders");
    revalidatePath(`/orders/${input.id}`);

    return { success: true, data: serializeOrder(order) };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// ──────────────────────────────────────────────
// DELETE Order
// ──────────────────────────────────────────────

export async function deleteOrder(id: string) {
  try {
    await db.order.delete({
      where: { id },
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard/orders");

    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

// ──────────────────────────────────────────────
// GET Order Statistics (Admin Dashboard)
// ──────────────────────────────────────────────

export async function getOrderStatistics() {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "CONFIRMED" } }),
      db.order.count({ where: { status: "PROCESSING" } }),
      db.order.count({ where: { status: "SHIPPED" } }),
      db.order.count({ where: { status: "DELIVERED" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        todayOrders,
      },
    };
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
