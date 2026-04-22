"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
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
  ImageIcon,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  toggleProductStatus,
  toggleProductFeatured,
} from "@/actions/productActions";
import { getCategories, createCategory } from "@/actions/categoriesAction";
import type {
  CreateCategoryInput,
  CreateProductInput,
  SerializedCategory,
  SerializedProductWithCategory,
  UpdateProductInput,
} from "@/types";
import toast from "react-hot-toast";
import Uploader from "@/components/admin/Uploader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Header from "@/components/admin/Header";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ImageSlider from "@/components/main/ImageSlider";

type InlineEditableField =
  | "priceIndividual"
  | "priceRestaurant"
  | "stock"
  | "categoryId";

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  priceIndividual: number;
  priceRestaurant: number;
  unit: string;
  stock: number;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
};

function buildInitialProductForm(
  product: SerializedProductWithCategory | null,
  categories: SerializedCategory[],
): ProductFormState {
  return {
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    priceIndividual: product?.priceIndividual ?? 0,
    priceRestaurant: product?.priceRestaurant ?? 0,
    unit: product?.unit || "piece",
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId || categories[0]?.id || "",
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    images: product?.images || [],
  };
}

// ── Create Category Modal ─────────────────────────────────────────────────────

function CreateCategoryModal({
  onClose,
  onSave,
  isPending,
}: {
  onClose: () => void;
  onSave: (data: Pick<CreateCategoryInput, "name" | "description">) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) return;

    onSave({
      name: normalizedName,
      description: description.trim() || undefined,
    });
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
            aria-label="Close"
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
  categories: SerializedCategory[];
  onClose: () => void;
  onSave: (data: CreateProductInput) => void;
  onCreateCategory: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<ProductFormState>(
    buildInitialProductForm(product, categories),
  );

  useEffect(() => {
    if (!form.categoryId && categories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateProductInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      priceIndividual: form.priceIndividual,
      priceRestaurant: form.priceRestaurant,
      unit: form.unit.trim() || "piece",
      stock: Math.max(0, Math.trunc(form.stock)),
      categoryId: form.categoryId || undefined,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      images: form.images.filter((image) => image.trim().length > 0),
    };

    if (!payload.name || !payload.slug) return;
    onSave(payload);
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .trim()
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
            aria-label="Close"
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
                <div className="col-span-1">
                  {form.images.length > 0 ? (
                    <ImageSlider
                      images={form.images}
                      altBase="Flavour image"
                      className="w-full aspect-square rounded-lg bg-[var(--bg-muted)]"
                      imageClassName="object-cover"
                      onRemove={handleRemoveImage}
                      showCounter={true}
                    />
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--text-muted)]">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">No images</span>
                    </div>
                  )}
                </div>

                <div className="col-span-1 space-y-3">
                  <Uploader
                    handleUploadComplete={handleImageUpload}
                    buttonText="Add Image"
                    maxFileCount={5}
                  />

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
                    Upload up to 5 images. First image will be the main display image.
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
                      stock: parseInt(e.target.value, 10) || 0,
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
                <span className="text-sm text-[var(--text-primary)]">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">Featured</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
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
  const [loadError, setLoadError] = useState<string | null>(null);

  const [products, setProducts] = useState<SerializedProductWithCategory[]>([]);
  const [categories, setCategories] = useState<SerializedCategory[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<SerializedProductWithCategory | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setLoadError(null);

    try {
      const [productsResult, categoriesResult] = await Promise.all([
        getProducts({
          isActive: undefined,
          limit: 500,
          sortBy: "order",
          sortOrder: "asc",
        }),
        getCategories({
          sortBy: "order",
          sortOrder: "asc",
          limit: 500,
        }),
      ]);

      if (!productsResult.success) {
        throw new Error(productsResult.error || "Failed to fetch products");
      }

      if (!categoriesResult.success) {
        throw new Error(categoriesResult.error || "Failed to fetch categories");
      }

      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
      setTotalProducts(productsResult.total ?? productsResult.data?.length ?? 0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load dashboard data";
      setLoadError(message);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const term = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.slug.toLowerCase().includes(term) ||
        product.category?.name.toLowerCase().includes(term),
    );
  }, [products, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredProducts.length, pageSize]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredIds = useMemo(
    () => filteredProducts.map((product) => product.id),
    [filteredProducts],
  );

  const filteredIdSet = useMemo(() => new Set(filteredIds), [filteredIds]);

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIdSet.has(product.id));

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      if (filteredProducts.length === 0) return prev;

      if (isAllSelected) {
        return prev.filter((id) => !filteredIdSet.has(id));
      }

      const next = new Set(prev);
      for (const id of filteredIds) next.add(id);
      return Array.from(next);
    });
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteClick = (target: string | string[]) => {
    setDeleteTarget(target);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = Array.isArray(deleteTarget)
        ? await deleteProducts(deleteTarget)
        : await deleteProduct(deleteTarget);

      if (result.success) {
        toast.success(result.message || "Deleted successfully");
        setSelectedIds([]);
        await fetchData(false);
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
          prev.map((product) => (product.id === id ? result.data! : product)),
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
          prev.map((product) => (product.id === id ? result.data! : product)),
        );
        toast.success("Featured status updated");
      } else {
        toast.error(result.error || "Failed to update featured status");
      }
    });
  };

  const handleUpdateField = (
    id: string,
    field: InlineEditableField,
    value: number | string,
  ) => {
    startTransition(async () => {
      const payload: UpdateProductInput = { id };

      if (field === "priceIndividual") {
        payload.priceIndividual = value as number;
      } else if (field === "priceRestaurant") {
        payload.priceRestaurant = value as number;
      } else if (field === "stock") {
        payload.stock = value as number;
      } else if (field === "categoryId") {
        const nextCategoryId = (value as string).trim();
        payload.categoryId = nextCategoryId || undefined;
      }

      const result = await updateProduct(payload);

      if (result.success && result.data) {
        setProducts((prev) =>
          prev.map((product) => (product.id === id ? result.data! : product)),
        );
        toast.success("Updated successfully");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  const handleSaveProduct = (data: CreateProductInput) => {
    startTransition(async () => {
      const result = editingProduct
        ? await updateProduct({ id: editingProduct.id, ...data })
        : await createProduct(data);

      if (result.success) {
        toast.success(editingProduct ? "Flavour updated" : "Flavour created");
        setShowModal(false);
        setEditingProduct(null);
        await fetchData(false);
      } else {
        toast.error(result.error || "Failed to save flavour");
      }
    });
  };

  const handleCreateCategory = (data: Pick<CreateCategoryInput, "name" | "description">) => {
    startTransition(async () => {
      const payload: CreateCategoryInput = {
        name: data.name,
        description: data.description,
      };

      const result = await createCategory(payload);

      if (result.success && result.data) {
        setCategories((prev) =>
          [...prev, result.data!].sort(
            (a, b) => a.order - b.order || a.name.localeCompare(b.name),
          ),
        );
        toast.success(`Category "${result.data.name}" created`);
        setShowCategoryModal(false);
      } else {
        toast.error(result.error || "Failed to create category");
      }
    });
  };

  const columns: DataTableColumn<SerializedProductWithCategory>[] = [
    {
      id: "select",
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
          disabled={filteredProducts.length === 0}
          className="w-4 h-4 rounded disabled:opacity-50"
        />
      ),
      headerClassName: "w-12",
      cellClassName: "w-12",
      render: (product) => (
        <input
          type="checkbox"
          checked={selectedIdSet.has(product.id)}
          onChange={() => handleSelectOne(product.id)}
          className="w-4 h-4 rounded"
        />
      ),
    },
    {
      id: "flavour",
      header: "Flavour",
      headerClassName: "min-w-[240px]",
      render: (product) => (
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
            <div className="font-medium text-[var(--text-primary)]">{product.name}</div>
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
      ),
    },
    {
      id: "category",
      header: "Category",
      headerClassName: "min-w-[170px]",
      render: (product) => (
        <select
          value={product.categoryId || ""}
          onChange={(e) =>
            handleUpdateField(product.id, "categoryId", e.target.value)
          }
          disabled={isPending}
          className="px-2 py-1 text-xs font-medium bg-[var(--bg-muted)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] rounded-full text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
        >
          <option value="">No Category (General)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: "priceIndividual",
      header: "Individual Price",
      headerClassName: "min-w-[150px]",
      render: (product) => (
        <div>
          <input
            type="number"
            defaultValue={product.priceIndividual}
            onFocus={(e) => {
              e.currentTarget.dataset.originalValue = e.currentTarget.value;
            }}
            onBlur={(e) => {
              const newValue = parseFloat(e.currentTarget.value) || 0;
              const originalValue = parseFloat(
                e.currentTarget.dataset.originalValue || "0",
              );
              if (newValue !== originalValue) {
                handleUpdateField(product.id, "priceIndividual", newValue);
              }
            }}
            step="0.001"
            min="0"
            disabled={isPending}
            className="w-24 px-2 py-1 text-sm font-medium border border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] rounded bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
          <span className="text-xs text-[var(--text-muted)] ml-1">TND</span>
        </div>
      ),
    },
    {
      id: "priceRestaurant",
      header: "Restaurant Price",
      headerClassName: "min-w-[160px]",
      render: (product) => (
        <div>
          <input
            type="number"
            defaultValue={product.priceRestaurant}
            onFocus={(e) => {
              e.currentTarget.dataset.originalValue = e.currentTarget.value;
            }}
            onBlur={(e) => {
              const newValue = parseFloat(e.currentTarget.value) || 0;
              const originalValue = parseFloat(
                e.currentTarget.dataset.originalValue || "0",
              );
              if (newValue !== originalValue) {
                handleUpdateField(product.id, "priceRestaurant", newValue);
              }
            }}
            step="0.001"
            min="0"
            disabled={isPending}
            className="w-24 px-2 py-1 text-sm font-medium border border-transparent hover:border-[var(--border)] focus:border-[var(--success)] rounded bg-transparent text-[var(--success)] focus:outline-none focus:ring-1 focus:ring-[var(--success)]"
          />
          <span className="text-xs text-[var(--text-muted)] ml-1">TND</span>
        </div>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      headerClassName: "min-w-[130px]",
      render: (product) => (
        <div>
          <input
            type="number"
            defaultValue={product.stock}
            onFocus={(e) => {
              e.currentTarget.dataset.originalValue = e.currentTarget.value;
            }}
            onBlur={(e) => {
              const newValue = parseInt(e.currentTarget.value, 10) || 0;
              const originalValue = parseInt(
                e.currentTarget.dataset.originalValue || "0",
                10,
              );
              if (newValue !== originalValue) {
                handleUpdateField(product.id, "stock", newValue);
              }
            }}
            min="0"
            disabled={isPending}
            className={`w-16 px-2 py-1 text-xs font-medium border border-transparent hover:border-[var(--border)] rounded-full text-center focus:outline-none focus:ring-1 ${product.stock > 10
              ? "bg-[var(--success-light)] text-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]"
              : product.stock > 0
                ? "bg-[var(--warning-light)] text-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]"
                : "bg-[var(--danger-light)] text-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]"
              }`}
          />
          <span className="text-xs text-[var(--text-muted)] ml-1">{product.unit}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      headerClassName: "min-w-[110px]",
      render: (product) => (
        <button
          onClick={() => handleToggleStatus(product.id)}
          disabled={isPending}
          className={`flex items-center cursor-pointer gap-1.5 px-2 py-1 text-xs font-medium rounded-full transition-colors ${product.isActive
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
      ),
    },
    {
      id: "featured",
      header: "Featured",
      headerClassName: "min-w-[95px]",
      render: (product) => (
        <button
          onClick={() => handleToggleFeatured(product.id)}
          disabled={isPending}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${product.isFeatured
            ? "bg-[var(--warning-light)] text-[var(--warning)]"
            : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
            }`}
        >
          <Star className={`w-4 h-4 ${product.isFeatured ? "fill-current" : ""}`} />
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right min-w-[120px]",
      cellClassName: "text-right",
      render: (product) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setEditingProduct(product);
              setShowModal(true);
            }}
            className="p-2 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
            title="Edit flavour"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(product.id)}
            className="p-2 rounded-lg hover:bg-[var(--danger-light)] text-[var(--text-secondary)] hover:text-[var(--danger)]"
            title="Delete flavour"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden p-6">
      <div className="h-full overflow-y-auto space-y-6 pr-1">
        {/* Header - Always visible immediately */}
        <Header
          title="Flavours / Products"
          description={
            <>
              {totalProducts} total flavours • These are the flavour options customers
              can choose when building their boxes
            </>
          }
          rightContent={
            <PrimaryButton
              as="button"
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              variant="primary"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Plus className="w-5 h-5" />
              Add Flavour
            </PrimaryButton>
          }
        />

        {/* Error Message */}
        {loadError && (
          <div className="bg-[var(--danger-light)] border border-[var(--danger)] text-[var(--danger)] rounded-xl p-4">
            {loadError}
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-xl p-4 flex items-start gap-3">
          <Package className="w-5 h-5 text-[var(--primary)] mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--primary)]">
              How Pricing Works
            </p>
            <p className="text-sm text-[var(--primary)]/80 mt-1">
              Each flavour has two prices: <strong>Individual Price</strong> for small
              boxes (6, 8, 12 pieces) and <strong>Restaurant Price</strong> for bulk
              orders (300, 600, 900 pieces). Restaurant prices should be lower to
              reflect bulk discounts.
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

        {/* DataTable with pagination */}
        <DataTable
          data={filteredProducts}
          columns={columns}
          rowKey={(product) => product.id}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 20, 30, 50, 100]}
          loading={isLoading && products.length === 0}
          loadingRowCount={6}
          maxBodyHeightClass="max-h-[52dvh]"
          tableClassName="w-full"
          getRowClassName={(product) =>
            `hover:bg-[var(--bg-muted)]/50 transition-colors ${selectedIdSet.has(product.id) ? "bg-[var(--primary-light)]/30" : ""
            }`
          }
          emptyState={
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">No flavours found</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Add your first flavour to get started
              </p>
            </div>
          }
        />
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
                    {Array.isArray(deleteTarget) && deleteTarget.length > 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {Array.isArray(deleteTarget)
                      ? `${deleteTarget.length} flavours will be processed`
                      : "This flavour will be processed"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Flavours with existing orders will be deactivated instead of deleted.
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
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}