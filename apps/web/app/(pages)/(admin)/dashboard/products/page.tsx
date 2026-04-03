"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  Package,
  X,
  AlertTriangle,
  Loader2,
  FolderPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import {
  SerializedProductWithCategory,
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  toggleProductStatus,
  toggleProductFeatured,
  createCategory,
} from "@/actions/productActions";
import { Category } from "@monkeyprint/db";
import toast from "react-hot-toast";
import Uploader from "@/components/admin/Uploader";

// ── Image Carousel ────────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  onRemove,
}: {
  images: string[];
  onRemove?: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const goNext = () => setCurrentIndex((i) => (i + 1) % images.length);
  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[var(--bg-muted)]">
      <Image
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        fill
        className="object-cover"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Remove Button */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(currentIndex)}
          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Image Counter */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-[var(--bg-muted)] rounded animate-pulse" />
        <div className="h-10 w-36 bg-[var(--bg-muted)] rounded animate-pulse" />
      </div>
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="h-10 w-64 bg-[var(--bg-muted)] rounded animate-pulse" />
        </div>
        <div className="divide-y divide-[var(--border)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-5 h-5 bg-[var(--bg-muted)] rounded animate-pulse" />
              <div className="w-16 h-16 bg-[var(--bg-muted)] rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-[var(--bg-muted)] rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-[var(--bg-muted)] rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-[var(--bg-muted)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Create Category Modal ─────────────────────────────────────────────────────

function CreateCategoryModal({
  onClose,
  onSave,
  isPending,
}: {
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-card)] rounded-xl max-w-md w-full overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Create New Category
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-muted)] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Crevette, Calamar"
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this category"
                rows={2}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="btn btn-primary"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Product Modal ─────────────────────────────────────────────────────────────

function ProductModal({
  product,
  categories,
  onClose,
  onSave,
  onCreateCategory,
  isPending,
}: {
  product: SerializedProductWithCategory | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => void;
  onCreateCategory: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    priceIndividual: product ? product.priceIndividual : 0,
    priceRestaurant: product ? product.priceRestaurant : 0,
    unit: product?.unit || "piece",
    stock: product?.stock || 0,
    categoryId: product?.categoryId || (categories[0]?.id ?? ""),
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    images: product?.images || [],
  });

  // Update categoryId if categories change (after creating a new one)
  useEffect(() => {
    if (!form.categoryId && categories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      categoryId: form.categoryId || undefined,
    });
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleImageUpload = (res: { url: string }[]) => {
    const newImages = res.map((r) => r.url);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        className="bg-[var(--bg-card)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {product ? "Edit Flavour" : "Add Flavour"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-muted)] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-4">
            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Flavour Images
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Image Preview / Carousel */}
                <div className="col-span-1">
                  {form.images.length > 0 ? (
                    <ImageCarousel
                      images={form.images}
                      onRemove={handleRemoveImage}
                    />
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--text-muted)]">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">No images</span>
                    </div>
                  )}
                </div>

                {/* Upload Button & Thumbnails */}
                <div className="col-span-1 space-y-3">
                  <Uploader
                    handleUploadComplete={handleImageUpload}
                    buttonText="Add Image"
                    maxFileCount={5}
                  />

                  {/* Thumbnails Grid */}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {form.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg-muted)] group"
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-[var(--text-muted)]">
                    Upload up to 5 images. First image will be the main display
                    image.
                  </p>
                </div>
              </div>
            </div>

            {/* Name and Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Flavour Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onBlur={() => !product && generateSlug()}
                  placeholder="e.g., Pistache, Amande, Spicy"
                  required
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="flavour-slug"
                  required
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Flavour description"
                rows={3}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-[var(--bg-muted)] rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Pricing per Piece (TND)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Individual Price *
                  </label>
                  <input
                    type="number"
                    value={form.priceIndividual}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priceIndividual: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0.000"
                    step="0.001"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    For boxes of 6, 8, or 12 pieces
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Restaurant Price *
                  </label>
                  <input
                    type="number"
                    value={form.priceRestaurant}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priceRestaurant: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0.000"
                    step="0.001"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    For bulk orders (300, 600, 900 pieces)
                  </p>
                </div>
              </div>
            </div>

            {/* Unit and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="piece"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Category with Create Option */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Category (Optional)
              </label>
              <div className="flex gap-2">
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">No Category (General)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onCreateCategory}
                  className="px-3 py-2 bg-[var(--bg-muted)] hover:bg-[var(--primary-light)] text-[var(--text-primary)] hover:text-[var(--primary)] rounded-lg transition-colors flex items-center gap-2"
                  title="Create new category"
                >
                  <FolderPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Featured
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : product ? (
                "Update Flavour"
              ) : (
                "Create Flavour"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<SerializedProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<SerializedProductWithCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([getProducts({ isActive: undefined }), getCategories()]).then(
      ([productsResult, categoriesResult]) => {
        setProducts(productsResult.data || []);
        setCategories(categoriesResult.data || []);
        setTotalProducts(productsResult.total);
        setIsLoading(false);
      },
    );
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term),
    );
  }, [products, search]);

  const isAllSelected =
    filteredProducts.length > 0 &&
    selectedIds.length === filteredProducts.length;

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : filteredProducts.map((p) => p.id));
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDeleteClick = (target: string | string[]) => {
    setDeleteTarget(target);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = Array.isArray(deleteTarget)
        ? await deleteProducts(deleteTarget)
        : await deleteProduct(deleteTarget);

      if (result.success) {
        toast.success(result.message || "Deleted successfully");
        setProducts((prev) =>
          Array.isArray(deleteTarget)
            ? prev.filter((p) => !deleteTarget.includes(p.id))
            : prev.filter((p) => p.id !== deleteTarget),
        );
        setSelectedIds([]);
      } else {
        toast.error(result.error || "Failed to delete");
      }

      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    });
  };

  const handleToggleStatus = (id: string) => {
    startTransition(async () => {
      const result = await toggleProductStatus(id);
      if (result.success && result.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isActive: result.data!.isActive } : p,
          ),
        );
        toast.success("Status updated");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleToggleFeatured = (id: string) => {
    startTransition(async () => {
      const result = await toggleProductFeatured(id);
      if (result.success && result.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isFeatured: result.data!.isFeatured } : p,
          ),
        );
        toast.success("Featured status updated");
      } else {
        toast.error(result.error || "Failed to update featured status");
      }
    });
  };

  const handleUpdateField = (
    id: string,
    field: "priceIndividual" | "priceRestaurant" | "stock" | "categoryId",
    value: number | string,
  ) => {
    startTransition(async () => {
      const result = await updateProduct({
        id,
        [field]: value,
      });

      if (result.success && result.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? result.data! : p)),
        );
        toast.success("Updated successfully");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  const handleSaveProduct = (data: any) => {
    startTransition(async () => {
      const result = editingProduct
        ? await updateProduct({ id: editingProduct.id, ...data })
        : await createProduct(data);

      if (result.success && result.data) {
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? result.data! : p)),
          );
          toast.success("Flavour updated");
        } else {
          setProducts((prev) => [result.data!, ...prev]);
          setTotalProducts((n) => n + 1);
          toast.success("Flavour created");
        }
        setShowModal(false);
        setEditingProduct(null);
      } else {
        toast.error(result.error || "Failed to save flavour");
      }
    });
  };

  const handleCreateCategory = (data: {
    name: string;
    description?: string;
  }) => {
    startTransition(async () => {
      const result = await createCategory(data);

      if (result.success && result.data) {
        setCategories((prev) => [...prev, result.data!]);
        toast.success(`Category "${result.data.name}" created`);
        setShowCategoryModal(false);
      } else {
        toast.error(result.error || "Failed to create category");
      }
    });
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Flavours / Products
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {totalProducts} total flavours • These are the flavour options
            customers can choose when building their boxes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Flavour
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-xl p-4 flex items-start gap-3">
        <Package className="w-5 h-5 text-[var(--primary)] mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">
            How Pricing Works
          </p>
          <p className="text-sm text-[var(--primary)]/80 mt-1">
            Each flavour has two prices: <strong>Individual Price</strong> for
            small boxes (6, 8, 12 pieces) and <strong>Restaurant Price</strong>{" "}
            for bulk orders (300, 600, 900 pieces). Restaurant prices should be
            lower to reflect bulk discounts.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flavours..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={() => handleDeleteClick(selectedIds)}
            className="btn bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Flavour
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Category
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Individual Price
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Restaurant Price
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Stock
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                Featured
              </th>
              <th className="p-4 text-right text-sm font-medium text-[var(--text-secondary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-[var(--bg-muted)]/50 transition-colors ${
                  selectedIds.includes(product.id)
                    ? "bg-[var(--primary-light)]/30"
                    : ""
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => handleSelectOne(product.id)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-muted)] overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
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
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {product.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {product.slug}
                        {product.images.length > 1 && (
                          <span className="ml-2 text-[var(--primary)]">
                            +{product.images.length - 1} images
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <select
                    value={product.categoryId || ""}
                    onChange={(e) =>
                      handleUpdateField(
                        product.id,
                        "categoryId",
                        e.target.value,
                      )
                    }
                    disabled={isPending}
                    className="px-2 py-1 text-xs font-medium bg-[var(--bg-muted)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] rounded-full text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    defaultValue={product.priceIndividual}
                    onFocus={(e) =>
                      (e.target.dataset.originalValue = e.target.value)
                    }
                    onBlur={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      const originalValue = parseFloat(
                        e.target.dataset.originalValue || "0",
                      );
                      if (newValue !== originalValue) {
                        handleUpdateField(
                          product.id,
                          "priceIndividual",
                          newValue,
                        );
                      }
                    }}
                    step="0.001"
                    min="0"
                    disabled={isPending}
                    className="w-24 px-2 py-1 text-sm font-medium border border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] rounded bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] ml-1">
                    TND
                  </span>
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    defaultValue={product.priceRestaurant}
                    onFocus={(e) =>
                      (e.target.dataset.originalValue = e.target.value)
                    }
                    onBlur={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      const originalValue = parseFloat(
                        e.target.dataset.originalValue || "0",
                      );
                      if (newValue !== originalValue) {
                        handleUpdateField(
                          product.id,
                          "priceRestaurant",
                          newValue,
                        );
                      }
                    }}
                    step="0.001"
                    min="0"
                    disabled={isPending}
                    className="w-24 px-2 py-1 text-sm font-medium border border-transparent hover:border-[var(--border)] focus:border-[var(--success)] rounded bg-transparent text-[var(--success)] focus:outline-none focus:ring-1 focus:ring-[var(--success)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] ml-1">
                    TND
                  </span>
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    defaultValue={product.stock}
                    onFocus={(e) =>
                      (e.target.dataset.originalValue = e.target.value)
                    }
                    onBlur={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      const originalValue = parseInt(
                        e.target.dataset.originalValue || "0",
                      );
                      if (newValue !== originalValue) {
                        handleUpdateField(product.id, "stock", newValue);
                      }
                    }}
                    min="0"
                    disabled={isPending}
                    className={`w-16 px-2 py-1 text-xs font-medium border border-transparent hover:border-[var(--border)] rounded-full text-center focus:outline-none focus:ring-1 ${
                      product.stock > 10
                        ? "bg-[var(--success-light)] text-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]"
                        : product.stock > 0
                          ? "bg-[var(--warning-light)] text-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]"
                          : "bg-[var(--danger-light)] text-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]"
                    }`}
                  />
                  <span className="text-xs text-[var(--text-muted)] ml-1">
                    {product.unit}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    disabled={isPending}
                    className={`flex items-center cursor-pointer gap-1.5 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                      product.isActive
                        ? "bg-[var(--success-light)] text-[var(--success)]"
                        : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                    }`}
                  >
                    {product.isActive ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleFeatured(product.id)}
                    disabled={isPending}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      product.isFeatured
                        ? "bg-[var(--warning-light)] text-[var(--warning)]"
                        : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${product.isFeatured ? "fill-current" : ""}`}
                    />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="p-2 rounded-lg hover:bg-[var(--danger-light)] text-[var(--text-secondary)] hover:text-[var(--danger)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No flavours found</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Add your first flavour to get started
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editingProduct}
            categories={categories}
            onClose={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
            onSave={handleSaveProduct}
            onCreateCategory={() => setShowCategoryModal(true)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Create Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <CreateCategoryModal
            onClose={() => setShowCategoryModal(false)}
            onSave={handleCreateCategory}
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
                    Delete Flavour
                    {Array.isArray(deleteTarget) && deleteTarget.length > 1
                      ? "s"
                      : ""}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {Array.isArray(deleteTarget)
                      ? `${deleteTarget.length} flavours will be deleted`
                      : "This flavour will be deleted"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Flavours with existing orders will be deactivated instead of
                deleted.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isPending}
                  className="btn bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90"
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
