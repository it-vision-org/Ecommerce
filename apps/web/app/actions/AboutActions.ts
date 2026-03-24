"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";
import { getCurrentSchoolYear } from "@/lib/utils";
import { ClubMemberData, ActionResult, CreateMemberInput, UpdateMemberInput } from "@/types";

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getFounders(): Promise<ActionResult<ClubMemberData[]>> {
  try {
    const founders = await db.clubMember.findMany({
      where: { isFounder: true, isDeleted: false },
      orderBy: { order: "asc" },
    });
    return { success: true, data: founders };
  } catch (error) {
    console.error("[ABOUT] Error fetching founders:", error);
    return { success: false, error: "Failed to fetch founders" };
  }
}

export async function getCurrentYearMembers(): Promise<
  ActionResult<ClubMemberData[]>
> {
  const schoolYear = getCurrentSchoolYear();
  try {
    const members = await db.clubMember.findMany({
      where: { schoolYear, isFounder: false, isDeleted: false },
      orderBy: { order: "asc" },
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("[ABOUT] Error fetching current year members:", error);
    return { success: false, error: "Failed to fetch members" };
  }
}

export async function getAllMembersForAdmin(): Promise<
  ActionResult<ClubMemberData[]>
> {
  try {
    const members = await db.clubMember.findMany({
      where: { isDeleted: false },
      orderBy: [
        { isFounder: "desc" },
        { schoolYear: "desc" },
        { order: "asc" },
      ],
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("[ABOUT] Error fetching all members:", error);
    return { success: false, error: "Failed to fetch members" };
  }
}

// ─── Create ────────────────────────────────────────────────────────────────────

export async function createMember(
  input: CreateMemberInput,
): Promise<ActionResult<ClubMemberData>> {
  const name = input.name?.trim();
  const role = input.role?.trim();

  if (!name || !role) {
    return { success: false, error: "Name and role are required" };
  }

  try {
    const resolvedYear = input.isFounder
      ? null
      : (input.schoolYear ?? getCurrentSchoolYear());

    const lastMember = await db.clubMember.findFirst({
      where: {
        isFounder: input.isFounder,
        schoolYear: resolvedYear,
        isDeleted: false,
      },
      orderBy: { order: "desc" },
    });

    const member = await db.clubMember.create({
      data: {
        name,
        role,
        image: input.image ?? null,
        isFounder: input.isFounder,
        schoolYear: resolvedYear,
        order: input.order ?? (lastMember ? lastMember.order + 1 : 0),
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true, data: member };
  } catch (error) {
    console.error("[ABOUT] Error creating member:", error);
    return { success: false, error: "Failed to create member" };
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export async function updateMember(
  input: UpdateMemberInput,
): Promise<ActionResult<ClubMemberData>> {
  if (!input.id) return { success: false, error: "Member ID is required" };

  try {
    const member = await db.clubMember.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.role !== undefined && { role: input.role.trim() }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.order !== undefined && { order: input.order }),
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true, data: member };
  } catch (error) {
    console.error("[ABOUT] Error updating member:", error);
    return { success: false, error: "Failed to update member" };
  }
}

// ─── Delete (soft) ─────────────────────────────────────────────────────────────

export async function deleteMember(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Member ID is required" };

  try {
    await db.clubMember.update({
      where: { id },
      data: { isDeleted: true },
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("[ABOUT] Error deleting member:", error);
    return { success: false, error: "Failed to delete member" };
  }
}

// ─── Reorder ───────────────────────────────────────────────────────────────────

export async function reorderMembers(
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.clubMember.update({ where: { id }, data: { order: index } }),
      ),
    );

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("[ABOUT] Error reordering members:", error);
    return { success: false, error: "Failed to reorder members" };
  }
}
