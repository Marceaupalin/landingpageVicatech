import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, societe, email, telephone, secteur, surface, message } = body;

    // Validation des champs requis
    if (!nom?.trim() || !societe?.trim() || !email?.trim() || !surface) {
      return NextResponse.json(
        { error: "Champs requis manquants (nom, société, email, surface)" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const surfaceNum = Number(surface);
    if (isNaN(surfaceNum) || surfaceNum <= 0) {
      return NextResponse.json({ error: "Surface invalide" }, { status: 400 });
    }

    // Calcul du tier de qualification
    const tier =
      surfaceNum >= 1000 ? "Viable" : "A écarter (surface insuffisante)";
    const tierColor = surfaceNum >= 1000 ? "#16a34a" : "#dc2626";

    // Horodatage Europe/Paris
    const timestamp = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(new Date());

    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (!notifyEmail || !resendKey) {
      console.error("Variables d'environnement manquantes: LEAD_NOTIFY_EMAIL ou RESEND_API_KEY");
      return NextResponse.json(
        { error: "Configuration serveur manquante" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);
    const subject = `Lead VivaTech: ${societe} (${secteur || "Non précisé"}, ${surfaceNum}m²) - ${tier}`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E2A3A; padding: 24px; background: #FAFAF7;">

  <div style="background: white; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
    <h2 style="margin: 0 0 4px; color: #1E2A3A; font-size: 20px;">Nouveau lead VivaTech</h2>
    <p style="margin: 0 0 24px; color: #6b7280; font-size: 13px;">
      ${timestamp} &middot; Source: vivatech
    </p>

    <h3 style="color: #E8735C; font-size: 13px; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 12px; border-bottom: 1px solid #fde8e3; padding-bottom: 8px;">Contact</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 5px 0; color: #6b7280; width: 38%;">Prénom et nom</td>
        <td style="padding: 5px 0; font-weight: 600;">${nom}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6b7280;">Société</td>
        <td style="padding: 5px 0; font-weight: 600;">${societe}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6b7280;">Email</td>
        <td style="padding: 5px 0;"><a href="mailto:${email}" style="color: #E8735C;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6b7280;">Téléphone</td>
        <td style="padding: 5px 0;">${telephone || "Non renseigné"}</td>
      </tr>
    </table>

    <h3 style="color: #E8735C; font-size: 13px; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 12px; border-bottom: 1px solid #fde8e3; padding-bottom: 8px;">Qualification</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 5px 0; color: #6b7280; width: 38%;">Secteur</td>
        <td style="padding: 5px 0; font-weight: 600;">${secteur || "Non précisé"}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6b7280;">Surface</td>
        <td style="padding: 5px 0; font-weight: 600;">${surfaceNum} m²</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #6b7280;">Tier</td>
        <td style="padding: 5px 0; font-weight: 700; color: ${tierColor};">${tier}</td>
      </tr>
    </table>

    ${
      message?.trim()
        ? `
    <h3 style="color: #E8735C; font-size: 13px; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 12px; border-bottom: 1px solid #fde8e3; padding-bottom: 8px;">Message</h3>
    <p style="font-size: 14px; color: #374151; background: #f9fafb; padding: 12px 16px; border-radius: 8px; margin: 0 0 24px; white-space: pre-wrap;">${message}</p>
    `
        : ""
    }

    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
      Généré automatiquement par elio-robot.fr
    </p>
  </div>

</body>
</html>`;

    await resend.emails.send({
      from: "contact@elio-robot.fr",
      to: notifyEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi lead:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
