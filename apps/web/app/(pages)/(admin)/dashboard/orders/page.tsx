"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  X,
  ChevronDown,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertTriangle,
  Trash2,
  RefreshCcw,
  Edit,
  Save,
  Plus,
  Minus,
} from "lucide-react";
import {
  SerializedOrder,
  SerializedOrderItem,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStatistics,
  updateOrder,
} from "@/actions/ordersActions";
import { OrderStatus } from "@monkeyprint/db";
import Header from "@/components/admin/Header";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "var(--warning)",
    bgColor: "var(--warning-light)",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Processing",
    color: "var(--accent)",
    bgColor: "rgba(6, 182, 212, 0.1)",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    color: "var(--secondary)",
    bgColor: "rgba(100, 116, 139, 0.1)",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "var(--success)",
    bgColor: "var(--success-light)",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "var(--danger)",
    bgColor: "var(--danger-light)",
    icon: XCircle,
  },
};

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-[var(--bg-muted)] rounded-lg mb-2" />
        <div className="h-4 w-48 bg-[var(--bg-muted)] rounded mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--bg-muted)] rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-[var(--bg-muted)] rounded-xl" />
      </div>
    </div>
  );
}

// Edit Order Modal Component
function EditOrderModal({
  order,
  onClose,
  onSave,
  isPending,
}: {
  order: SerializedOrder;
  onClose: () => void;
  onSave: (updatedOrder: {
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
  }) => void;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail || "",
    address: order.address,
    notes: order.notes || "",
    shippingCost: order.shippingCost,
  });

  const [items, setItems] = useState(
    order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  const total = subtotal + formData.shippingCost;

  const handleItemQuantityChange = (index: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleItemPriceChange = (index: number, price: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, unitPrice: Math.max(0, price) } : item,
      ),
    );
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      toast.error("Order must have at least one item");
    }
  };

  const handleSubmit = () => {
    if (!formData.customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!formData.customerPhone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    onSave({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      address: formData.address,
      notes: formData.notes || null,
      shippingCost: formData.shippingCost,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary-light)] rounded-lg">
              <Edit className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Edit Order #{order.orderNumber}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Modify order details and items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-muted)] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items
            </h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-[var(--bg-muted)] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-[var(--text-muted)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)]">
                          Qty:
                        </span>
                        <div className="flex items-center border border-[var(--border)] rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleItemQuantityChange(index, -1)}
                            className="p-1 hover:bg-[var(--bg)] rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleItemQuantityChange(index, 1)}
                            className="p-1 hover:bg-[var(--bg)] rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)]">
                          Price:
                        </span>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemPriceChange(
                              index,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24 px-2 py-1 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                        <span className="text-xs text-[var(--text-muted)]">
                          TND
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--primary)]">
                      {(item.quantity * item.unitPrice).toFixed(3)} TND
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-1 p-1 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Cost */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Shipping Cost (TND)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={formData.shippingCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingCost: parseFloat(e.target.value) || 0,
                })
              }
              className="w-32 px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span className="text-[var(--text-primary)]">
                {subtotal.toFixed(3)} TND
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Shipping</span>
              <span className="text-[var(--text-primary)]">
                {formData.shippingCost === 0
                  ? "Free"
                  : `${formData.shippingCost.toFixed(3)} TND`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--border)]">
              <span className="text-[var(--text-primary)]">Total</span>
              <span className="text-[var(--primary)]">
                {total.toFixed(3)} TND
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  isPending,
}: {
  order: SerializedOrder;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
  isPending: boolean;
}) {
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-muted)] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: statusConfig.bgColor }}
              >
                <StatusIcon
                  className="w-5 h-5"
                  style={{ color: statusConfig.color }}
                />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Status</p>
                <p
                  className="font-semibold"
                  style={{ color: statusConfig.color }}
                >
                  {statusConfig.label}
                </p>
              </div>
            </div>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              disabled={isPending}
              className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Info */}
          <div className="bg-[var(--bg-muted)] rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)]">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)]">
                  {order.customerPhone}
                </span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2 col-span-2">
                  <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-primary)]">
                    {order.customerEmail}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2 col-span-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5" />
                <span className="text-[var(--text-primary)]">
                  {order.address}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-[var(--bg-muted)] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-[var(--text-muted)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">
                      {item.productName}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {item.quantity} × {item.unitPrice.toFixed(3)} TND
                    </p>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {item.totalPrice.toFixed(3)} TND
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-[var(--warning-light)] rounded-xl p-4">
              <h3 className="font-semibold text-[var(--warning)] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Order Notes
              </h3>
              <p className="text-sm text-[var(--text-primary)]">
                {order.notes}
              </p>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span className="text-[var(--text-primary)]">
                {order.subtotal.toFixed(3)} TND
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Shipping</span>
              <span className="text-[var(--text-primary)]">
                {order.shippingCost === 0
                  ? "Free"
                  : `${order.shippingCost.toFixed(3)} TND`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--border)]">
              <span className="text-[var(--text-primary)]">Total</span>
              <span className="text-[var(--primary)]">
                {order.total.toFixed(3)} TND
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminOrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [statistics, setStatistics] = useState<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    todayOrders: number;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(
    null,
  );
  const [editingOrder, setEditingOrder] = useState<SerializedOrder | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchData = async () => {
    try {
      const [ordersResult, statsResult] = await Promise.all([
        getOrders({ sortBy: "createdAt", sortOrder: "desc" }),
        getOrderStatistics(),
      ]);
      setOrders(ordersResult.data || []);
      if (statsResult.success) {
        setStatistics(statsResult.data as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.customerPhone.includes(term) ||
          order.customerEmail?.toLowerCase().includes(term),
      );
    }

    return result;
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus({ id: orderId, status });
      if (result.success) {
        toast.success(`Order status updated to ${STATUS_CONFIG[status].label}`);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleEditSave = async (updatedData: {
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
  }) => {
    if (!editingOrder) return;

    startTransition(async () => {
      const result = await updateOrder({
        id: editingOrder.id,
        ...updatedData,
      });

      if (result.success && result.data) {
        toast.success("Order updated successfully");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === editingOrder.id ? result.data! : order,
          ),
        );
        setEditingOrder(null);
        // Refresh statistics
        const statsResult = await getOrderStatistics();
        if (statsResult.success) {
          setStatistics(statsResult.data as any);
        }
      } else {
        toast.error(result.error || "Failed to update order");
      }
    });
  };

  const handleDeleteClick = (orderId: string) => {
    setDeleteTarget(orderId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteOrder(deleteTarget);
      if (result.success) {
        toast.success("Order deleted successfully");
        setOrders((prev) => prev.filter((order) => order.id !== deleteTarget));
        // Refresh statistics
        const statsResult = await getOrderStatistics();
        if (statsResult.success) {
          setStatistics(statsResult.data as any);
        }
      } else {
        toast.error(result.error || "Failed to delete order");
      }
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    });
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Header
        title="Orders"
        description={
          <>
            {statistics?.totalOrders || 0} total orders •{" "}
            {statistics?.todayOrders || 0} today
          </>
        }
        rightContent={
          <button
            onClick={fetchData}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <RefreshCcw className={"w-4 h-4 " + (isPending ? "animate-spin" : "")} />
            Refresh
          </button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--warning-light)] rounded-lg">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {statistics?.pendingOrders || 0}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary-light)] rounded-lg">
              <Package className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {statistics?.processingOrders || 0}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Processing</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--success-light)] rounded-lg">
              <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {statistics?.deliveredOrders || 0}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Delivered</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {statistics?.totalRevenue.toFixed(0) || 0}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Revenue (TND)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${statusFilter === "ALL"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg)]"
              }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((status) => {
            const config = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${statusFilter === status
                    ? "text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"
                  }`}
                style={{
                  backgroundColor:
                    statusFilter === status ? config.color : "var(--bg-muted)",
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Order
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Customer
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Items
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Total
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Date
                </th>
                <th className="p-4 text-right text-sm font-medium text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status];
                const StatusIcon = statusConfig.icon;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--bg-muted)]/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium text-[var(--text-primary)]">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {order.paymentMethod === "CASH_ON_DELIVERY"
                          ? "Cash on Delivery"
                          : "Bank Transfer"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-[var(--text-primary)]">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {order.customerPhone}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[var(--text-primary)]">
                        {order.items.length} item(s)
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[var(--primary)]">
                        {order.total.toFixed(3)} TND
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          disabled={isPending}
                          className="appearance-none pl-8 pr-8 py-1.5 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_CONFIG[status].label}
                            </option>
                          ))}
                        </select>
                        <StatusIcon
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: statusConfig.color }}
                        />
                        <ChevronDown
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                          style={{ color: statusConfig.color }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="p-2 rounded-lg hover:bg-[var(--primary-light)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order.id)}
                          className="p-2 rounded-lg hover:bg-[var(--danger-light)] text-[var(--text-secondary)] hover:text-[var(--danger)]"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(status) =>
              handleStatusChange(selectedOrder.id, status)
            }
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSave={handleEditSave}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-card)] rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--danger-light)] rounded-full">
                  <AlertTriangle className="w-6 h-6 text-[var(--danger)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    Delete Order
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Are you sure you want to delete this order? All associated data
                will be permanently removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[var(--danger)] hover:bg-[var(--danger)]/90 transition-colors flex items-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
