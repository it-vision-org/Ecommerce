"use server";

import { db } from "@monkeyprint/db";
import { sendContactFormEmail } from "@monkeyprint/utils/email";
import { getCurrentUser } from "./authActions";

interface ContactFormData {
  name: string;
  email: string;
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

const CONTACT_RECIPIENT =
  process.env.CONTACT_RECIPIENT || "ahmedzouaghi2003@gmail.com";

const subjectLabels: Record<string, string> = {
  general: "Question générale",
  student_support: "Soutien étudiant",
  parent_question: "Question parent",
  teacher_collaboration: "Collaboration enseignant",
  partnership: "Partenariat / sponsor",
  event: "Événement ou atelier",
  technical: "Problème technique",
  other: "Autre",
};

export async function sendContactEmail(data: ContactFormData) {
  const name = data.name?.trim();
  const email = data.email?.trim();
  const subject = data.subject?.trim();
  const message = data.message?.trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Tous les champs sont obligatoires" };
  }

  try {
    const currentUser = await getCurrentUser();
    const subjectLabel = subjectLabels[subject] || subject || "Contact";

    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        subject: subjectLabel,
        message,
        userId: currentUser?.id ?? null,
      },
    });

    await sendContactFormEmail({
      recipient: CONTACT_RECIPIENT,
      name,
      email,
      subject: subjectLabel,
      message,
    });

    return { success: true, id: submission.id };
  } catch (error) {
    console.error("[CONTACT] Error in sendContactEmail:", error);
    return { success: false, error: "Une erreur est survenue" };
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
            profileImage: true,
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
