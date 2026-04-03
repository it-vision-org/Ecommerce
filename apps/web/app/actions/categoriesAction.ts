"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@monkeyprint/db";

// Types
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

// Helper function to serialize category
function serializeCategory(category: any): SerializedCategory {
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ──────────────────────────────────────────────
// GET Categories
// ──────────────────────────────────────────────

export async function getCategories(options?: {
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "order" | "createdAt";
  sortOrder?: "asc" | "desc";
}) {
  try {
    const {
      isActive,
      search,
      limit = 50,
      offset = 0,
      sortBy = "order",
      sortOrder = "asc",
    } = options || {};

    const where: Prisma.CategoryWhereInput = {};

    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      db.category.count({ where }),
    ]);

    const serializedCategories = categories.map(serializeCategory);

    return { success: true, data: serializedCategories, total };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
      data: [],
      total: 0,
    };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: serializeCategory(category) };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: serializeCategory(category) };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

// ──────────────────────────────────────────────
// CREATE Category
// ──────────────────────────────────────────────

export async function createCategory(input: CreateCategoryInput) {
  try {
    const slug = input.slug || generateSlug(input.name);

    // Check if category with this slug already exists
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
    revalidatePath("/dashboard/categories");

    return { success: true, data: serializeCategory(category) };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

// ──────────────────────────────────────────────
// UPDATE Category
// ──────────────────────────────────────────────

export async function updateCategory(input: UpdateCategoryInput) {
  try {
    const { id, ...data } = input;

    // Check for slug conflicts (excluding current category)
    if (data.slug) {
      const existingCategory = await db.category.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingCategory) {
        return {
          success: false,
          error: "A category with this slug already exists",
        };
      }
    }

    const updateData: Prisma.CategoryUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      // Auto-generate slug if name changes and no custom slug provided
      if (!data.slug) {
        updateData.slug = generateSlug(data.name);
      }
    }
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const category = await db.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/categories");

    return { success: true, data: serializeCategory(category) };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

// ──────────────────────────────────────────────
// DELETE Category
// ──────────────────────────────────────────────

export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const productCount = await db.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${productCount} product(s). Please reassign or delete the products first.`,
      };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/categories");

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function deleteCategories(ids: string[]) {
  try {
    const categoriesWithProducts = await db.product.groupBy({
      by: ["categoryId"],
      where: { categoryId: { in: ids } },
    });

    const categoryIdsWithProducts = new Set(
      categoriesWithProducts.map((p) => p.categoryId).filter(Boolean),
    );
    const categoriesToDelete = ids.filter(
      (id) => !categoryIdsWithProducts.has(id),
    );
    const categoriesToDeactivate = ids.filter((id) =>
      categoryIdsWithProducts.has(id),
    );

    if (categoriesToDelete.length > 0) {
      await db.category.deleteMany({
        where: { id: { in: categoriesToDelete } },
      });
    }

    if (categoriesToDeactivate.length > 0) {
      await db.category.updateMany({
        where: { id: { in: categoriesToDeactivate } },
        data: { isActive: false },
      });
    }

    revalidatePath("/products");
    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: `${categoriesToDelete.length} categor${categoriesToDelete.length === 1 ? "y" : "ies"} deleted, ${categoriesToDeactivate.length} categor${categoriesToDeactivate.length === 1 ? "y" : "ies"} deactivated`,
      deleted: categoriesToDelete.length,
      deactivated: categoriesToDeactivate.length,
    };
  } catch (error) {
    console.error("Error deleting categories:", error);
    return { success: false, error: "Failed to delete categories" };
  }
}

// ──────────────────────────────────────────────
// TOGGLE Category Status
// ──────────────────────────────────────────────

export async function toggleCategoryStatus(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const updated = await db.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/categories");

    return { success: true, data: serializeCategory(updated) };
  } catch (error) {
    console.error("Error toggling category status:", error);
    return { success: false, error: "Failed to toggle category status" };
  }
}
