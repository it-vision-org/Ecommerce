"use server";

import { db } from "@monkeyprint/db";
import { Prisma } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";

// Types
export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

// Serialized version for client components
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

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
};

// Helper function to serialize product
function serializeProduct(
  product: ProductWithCategory,
): SerializedProductWithCategory {
  return {
    ...product,
    priceIndividual: Number(product.priceIndividual),
    priceRestaurant: Number(product.priceRestaurant),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
      ...product.category,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    },
  };
}

// ──────────────────────────────────────────────
// GET Products
// ──────────────────────────────────────────────

export async function getProducts(options?: {
  categoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "priceIndividual" | "createdAt" | "order";
  sortOrder?: "asc" | "desc";
}) {
  try {
    const {
      categoryId,
      isFeatured,
      isActive,
      search,
      limit = 50,
      offset = 0,
      sortBy = "order",
      sortOrder = "asc",
    } = options || {};

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (typeof isFeatured === "boolean") {
      where.isFeatured = isFeatured;
    }
    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      db.product.count({ where }),
    ]);

    // Serialize products before returning
    const serializedProducts = products.map(serializeProduct);

    return { success: true, data: serializedProducts, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
      data: [],
      total: 0,
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getFeaturedProducts(limit = 8) {
  try {
    const products = await db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { order: "asc" },
      take: limit,
    });

    return { success: true, data: products.map(serializeProduct) };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      error: "Failed to fetch featured products",
      data: [],
    };
  }
}

// ──────────────────────────────────────────────
// CREATE Product
// ──────────────────────────────────────────────

export async function createProduct(input: CreateProductInput) {
  try {
    // Check if product with this slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug: input.slug },
    });

    if (existingProduct) {
      return {
        success: false,
        error: "A product with this slug already exists",
      };
    }

    // If no categoryId provided, get or create a default category
    let categoryId = input.categoryId;
    if (!categoryId) {
      let defaultCategory = await db.category.findFirst({
        where: { slug: "general" },
      });

      if (!defaultCategory) {
        defaultCategory = await db.category.create({
          data: {
            name: "General",
            slug: "general",
            description: "Default category for products",
            isActive: true,
          },
        });
      }
      categoryId = defaultCategory.id;
    }

    const product = await db.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        priceIndividual: new Prisma.Decimal(input.priceIndividual),
        priceRestaurant: new Prisma.Decimal(input.priceRestaurant),
        unit: input.unit || "piece",
        stock: input.stock || 0,
        images: input.images || [],
        isFeatured: input.isFeatured || false,
        isActive: input.isActive ?? true,
        order: input.order || 0,
        categoryId: categoryId,
      },
      include: { category: true },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// ──────────────────────────────────────────────
// UPDATE Product
// ──────────────────────────────────────────────

export async function updateProduct(input: UpdateProductInput) {
  try {
    const { id, ...data } = input;

    // Check for slug conflicts (excluding current product)
    if (data.slug) {
      const existingProduct = await db.product.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingProduct) {
        return {
          success: false,
          error: "A product with this slug already exists",
        };
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.priceIndividual !== undefined) {
      updateData.priceIndividual = new Prisma.Decimal(data.priceIndividual);
    }
    if (data.priceRestaurant !== undefined) {
      updateData.priceRestaurant = new Prisma.Decimal(data.priceRestaurant);
    }
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.categoryId !== undefined) {
      updateData.category = { connect: { id: data.categoryId } };
    }

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// ──────────────────────────────────────────────
// DELETE Product
// ──────────────────────────────────────────────

export async function deleteProduct(id: string) {
  try {
    const orderItemCount = await db.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      await db.product.update({
        where: { id },
        data: { isActive: false },
      });

      revalidatePath("/products");
      revalidatePath("/dashboard/products");

      return {
        success: true,
        message:
          "Product has existing orders. It has been deactivated instead of deleted.",
      };
    }

    await db.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function deleteProducts(ids: string[]) {
  try {
    const productsWithOrders = await db.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { in: ids } },
    });

    const productIdsWithOrders = new Set(
      productsWithOrders.map((p) => p.productId),
    );
    const productsToDelete = ids.filter((id) => !productIdsWithOrders.has(id));
    const productsToDeactivate = ids.filter((id) =>
      productIdsWithOrders.has(id),
    );

    if (productsToDelete.length > 0) {
      await db.product.deleteMany({
        where: { id: { in: productsToDelete } },
      });
    }

    if (productsToDeactivate.length > 0) {
      await db.product.updateMany({
        where: { id: { in: productsToDeactivate } },
        data: { isActive: false },
      });
    }

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: `${productsToDelete.length} product(s) deleted, ${productsToDeactivate.length} product(s) deactivated`,
      deleted: productsToDelete.length,
      deactivated: productsToDeactivate.length,
    };
  } catch (error) {
    console.error("Error deleting products:", error);
    return { success: false, error: "Failed to delete products" };
  }
}

// ──────────────────────────────────────────────
// TOGGLE Product Status
// ──────────────────────────────────────────────

export async function toggleProductStatus(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const updated = await db.product.update({
      where: { id },
      data: { isActive: !product.isActive },
      include: { category: true }, // Add this
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return { success: true, data: serializeProduct(updated) }; // Serialize here
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "Failed to toggle product status" };
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { isFeatured: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const updated = await db.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
      include: { category: true }, // Add this
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");

    return { success: true, data: serializeProduct(updated) }; // Serialize here
  } catch (error) {
    console.error("Error toggling product featured:", error);
    return {
      success: false,
      error: "Failed to toggle product featured status",
    };
  }
}

// ──────────────────────────────────────────────
// GET Categories
// ──────────────────────────────────────────────

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories", data: [] };
  }
}

// ──────────────────────────────────────────────
// CREATE Category
// ──────────────────────────────────────────────

export async function createCategory(input: CreateCategoryInput) {
  try {
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        success: false,
        error: "A category with this slug already exists",
      };
    }

    const category = await db.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description || null,
        image: input.image || null,
        order: input.order || 0,
        isActive: input.isActive ?? true,
      },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/categories");

    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}
