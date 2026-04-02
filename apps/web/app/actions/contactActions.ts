"use server";

import { db } from "@monkeyprint/db";
import { sendContactFormEmail } from "@monkeyprint/utils/email";
import { getCurrentUser } from "./authActions";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string | null;
  user: {
    name: string | null;
    email: string;
    profileImage: string | null;
    userType: string | null;
    role: string;
  } | null;
}

const subjectLabels: Record<string, string> = {
  wholesale_order: "Wholesale / Bulk Order",
  order_issue: "Issue with Previous Order",
  product_inquiry: "Product Inquiry",
  restaurant_partnership: "Restaurant Partnership",
  export_inquiry: "Export Inquiry",
  general: "General Question",
  other: "Other",
};

async function getSuperAdminEmail(): Promise<string> {
  const superAdmin = await db.user.findFirst({
    where: { role: "SUPER_ADMIN", isDeleted: false },
    select: { email: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    superAdmin?.email || process.env.CONTACT_RECIPIENT || "ahmedzouaghi2003@gmail.com"
  );
}

export async function sendContactEmail(data: ContactFormData) {
  const name = data.name?.trim();
  const email = data.email?.trim();
  const phone = data.phone?.trim();
  const subject = data.subject?.trim();
  const message = data.message?.trim();

  if (!name || !email || !phone || !subject || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const currentUser = await getCurrentUser();
    const subjectLabel = subjectLabels[subject] || subject || "Contact";

    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        subject: subjectLabel,
        message: `Phone: ${phone}\n\n${message}`,
        userId: currentUser?.id ?? null,
      },
    });

    const recipient = await getSuperAdminEmail();

    await sendContactFormEmail({
      recipient,
      name,
      email,
      phone,
      subject: subjectLabel,
      message,
    });

    return { success: true, id: submission.id };
  } catch (error) {
    console.error("[CONTACT] Error in sendContactEmail:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

export async function getContactSubmissions(): Promise<{
  success: boolean;
  contacts?: ContactSubmission[];
  error?: string;
}> {
  try {
    const contacts = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            userType: true,
            role: true,
          },
        },
      },
    });

    return { success: true, contacts: contacts as ContactSubmission[] };
  } catch (error) {
    console.error("[CONTACT] Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function markContactAsRead(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("[CONTACT] Error marking contact as read:", error);
    return { success: false, error: "Failed to update contact" };
  }
}

export async function markContactAsUnread(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.contactSubmission.update({
      where: { id },
      data: { isRead: false },
    });
    return { success: true };
  } catch (error) {
    console.error("[CONTACT] Error marking contact as unread:", error);
    return { success: false, error: "Failed to update contact" };
  }
}

export async function deleteContactSubmission(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.contactSubmission.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("[CONTACT] Error deleting contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
