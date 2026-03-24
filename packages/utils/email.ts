import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/resetPassword?token=${token}`;

  // Professional HTML email template
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Wake Up & Spark</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td style="padding: 40px 20px;">
        
        <!-- Email Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #38bdf8 100%); padding: 40px 40px 60px 40px; text-align: center; position: relative;">
              <!-- Orange gradient: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%) -->
              
              <!-- Lock Icon -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80" style="margin: 0 auto 20px auto;">
                <tr>
                  <td style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 20px; text-align: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </td>
                </tr>
              </table>
              
              <!-- Title -->
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; font-family: 'Georgia', serif; line-height: 1.2;">
                Reset Your Password
              </h1>
            </td>
          </tr>
          
          <!-- Content Area -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Hello,
              </p>
              
              <!-- Main Message -->
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                We received a request to reset your password for your <strong>Wake Up & Spark</strong> account. Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 10px 0 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #38bdf8 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 16px 40px; border-radius: 12px; box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);">
                      <!-- Orange gradient: linear-gradient(135deg, #f97316 0%, #fbbf24 100%) -->
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                <!-- Orange: background-color: #fffbeb; border: 1px solid #fde68a; -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="24" style="vertical-align: top; padding-right: 12px;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <!-- Orange: stroke="#d97706" -->
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        </td>
                        <td style="font-size: 14px; line-height: 1.6; color: #0369a1;">
                          <!-- Orange: color: #b45309; -->
                          <strong style="display: block; margin-bottom: 4px; color: #0c4a6e;">Important:</strong>
                          <!-- Orange: color: #7c2d12; -->
                          This link will expire in <strong>24 hours</strong> for security reasons. If you didn't request this reset, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #3b82f6; word-break: break-all;">
                <!-- Orange: color: #f97316; -->
                <a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline;">${resetUrl}</a>
                <!-- Orange: color: #f97316; -->
              </p>
              
              <!-- Security Notice -->
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                For security reasons, never share this link with anyone. If you're concerned about your account security, please contact our support team.
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
              
              <!-- Logo/Brand Name -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td style="text-align: center;">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <!-- Spark Icon -->
                      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #38bdf8); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;">
                        <!-- Orange gradient: linear-gradient(135deg, #f97316, #fbbf24) -->
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
                        </svg>
                      </div>
                      <!-- Brand Text -->
                      <span style="font-size: 18px; font-weight: 700; color: #1e3a8a; font-family: 'Georgia', serif; vertical-align: middle;">
                        <!-- Orange: color: #7c2d12; -->
                        Wake Up & Spark
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Footer Text -->
              <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
                A community where students, teachers, and parents<br />grow together through shared wisdom.
              </p>
              
              <!-- Copyright -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8; text-align: center;">
                © ${new Date().getFullYear()} Wake Up & Spark. All rights reserved.
              </p>
              
            </td>
          </tr>
          
        </table>
        
        <!-- Extra Footer Note -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto 0 auto;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                This email was sent to <strong>${email}</strong>. If you didn't request a password reset, please contact support immediately.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;

  await resend.emails.send({
    from: "Wake Up & Spark <onboarding@resend.dev>",
    to: email,
    subject: "Reset Your Password - Wake Up & Spark",
    html: emailHtml,
  });
}

export async function sendContactFormEmail({
  recipient,
  name,
  email,
  subject,
  message,
}: {
  recipient: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    if (!recipient || !name || !email || !subject || !message) {
      console.error("[EMAIL] Missing required contact form fields");
      return { success: false, error: "Missing required fields" };
    }

    console.log("[SERVER] Sending contact form email to:", recipient);

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nouveau message - Wake Up & Spark</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(37,99,235,0.12);">
          <tr>
            <td style="padding:32px 32px 48px 32px;background:linear-gradient(135deg,#0f172a,#1e3a8a 50%,#2563eb);color:#ffffff;text-align:left;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#38bdf8,#3b82f6);display:flex;align-items:center;justify-content:center;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M7,2V13H10V22L17,10H13L17,2H7Z"/></svg>
                </div>
                <div>
                  <div style="font-size:13px;letter-spacing:0.6px;text-transform:uppercase;opacity:0.85;">Wake Up & Spark</div>
                  <div style="font-size:22px;font-weight:700;">Nouveau message de contact</div>
                </div>
              </div>
              <p style="margin:20px 0 0 0;font-size:15px;line-height:1.6;max-width:520px;opacity:0.9;">
                Un membre de la communauté (élève, parent ou enseignant) souhaite entrer en contact. Nous cultivons une réponse bienveillante et confidentielle.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0 0 6px 0;font-size:14px;color:#475569;">De</p>
              <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#0f172a;">${name} · <span style="color:#2563eb;">${email}</span></p>

              <p style="margin:0 0 6px 0;font-size:14px;color:#475569;">Sujet</p>
              <p style="margin:0 0 20px 0;font-size:16px;font-weight:600;color:#1e293b;">${subject}</p>

              <div style="padding:18px 20px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc;">
                <p style="margin:0 0 10px 0;font-size:14px;color:#475569;">Message</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:#0f172a;white-space:pre-line;">${message}</p>
              </div>

              <div style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap;">
                <span style="padding:8px 12px;border-radius:999px;background:rgba(37,99,235,0.08);color:#1e3a8a;font-size:12px;font-weight:600;">Confidentiel</span>
                <span style="padding:8px 12px;border-radius:999px;background:rgba(14,165,233,0.1);color:#0ea5e9;font-size:12px;font-weight:600;">Réponse sous 48h</span>
                <span style="padding:8px 12px;border-radius:999px;background:rgba(59,130,246,0.12);color:#2563eb;font-size:12px;font-weight:600;">Écoute bienveillante</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;color:#e2e8f0;border-radius:16px;padding:18px 20px;">
                <tr>
                  <td style="font-size:13px;line-height:1.6;">
                    <strong style="color:#f8fafc;">Pourquoi c’est important ?</strong><br />
                    Chaque message peut concerner une situation sensible (émotionnelle, scolaire, familiale). Traitez-le avec priorité et bienveillance.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;font-size:12px;color:#94a3b8;">
              Vous pouvez répondre directement à cet email, le champ « Répondre à » est déjà configuré.
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0 0;font-size:12px;color:#94a3b8;text-align:center;">
          Wake Up & Spark · espace sûr pour élèves, parents et enseignants
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResult = await resend.emails.send({
      from: "Wake Up & Spark <onboarding@resend.dev>",
      to: recipient,
      subject: `[Wake Up & Spark] ${subject}`,
      html,
    });

    if (!emailResult) {
      throw new Error("Failed to send email");
    }

    return { success: true, id: emailResult };
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return { success: false, error: "Failed to send email" };
  }
}