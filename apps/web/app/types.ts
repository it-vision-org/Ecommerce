import { Prisma } from "@monkeyprint/db";

// ──────────────────────────────────────────────
// Global Types
// ──────────────────────────────────────────────

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export type SortOrder = "asc" | "desc";

export interface UploadResponse {
  ufsUrl: string;
  url: string;
}

export interface ImageCarouselProps {
  images: string[];
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

export interface CarouselState {
  images: string[];
  startIndex: number;
  title: string;
}

export interface ImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

// ──────────────────────────────────────────────
// Products and Cart Types
// ──────────────────────────────────────────────

export type BoxConfig = {
  pieces: number;
  maxTypes: number;
};

export type CartSelection = {
  productId: string;
  productName: string;
  count: number;
};

export type CartItem = {
  productId: string;
  productName: string;
  boxSize: number;
  quantity: number;
  selections: CartSelection[];
  unitPrice: number;
  totalPrice: number;
};

export type CustomerType = "individual" | "restaurant";

export type ProductSortBy = "name" | "priceIndividual" | "createdAt" | "order";

export type GetProductsOptions = {
  categoryId?: string;
  excludeId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
};

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type SerializedProductWithCategory = Omit<
  ProductWithCategory,
  "priceIndividual" | "priceRestaurant" | "createdAt" | "updatedAt" | "category"
> & {
  priceIndividual: number;
  priceRestaurant: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateProductInput = {
  name: string;
  slug: string;
  description?: string;
  priceIndividual: number;
  priceRestaurant: number;
  unit?: string;
  stock?: number;
  images?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
  categoryId?: string;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  id: string;
};

// ──────────────────────────────────────────────
// Categories Types
// ──────────────────────────────────────────────

export type CategorySortBy = "name" | "order" | "createdAt";

export type GetCategoriesOptions = {
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: CategorySortBy;
  sortOrder?: SortOrder;
};

export type SerializedCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
  id: string;
};