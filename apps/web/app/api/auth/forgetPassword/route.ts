import { NextResponse } from "next/server";
import { db } from "@monkeyprint/db";
import { generateToken } from "@monkeyprint/utils/token";
import { sendPasswordResetEmail } from "@monkeyprint/utils/email";
import { forgotPasswordSchema } from "@monkeyprint/utils/zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.isDeleted) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a reset link has been sent.",
        },
        { status: 200 },
      );
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await db.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      { message: "If an account exists with this email, a reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/forgotPassword:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
