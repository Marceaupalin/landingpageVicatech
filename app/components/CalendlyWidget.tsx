"use client";

export default function CalendlyWidget({ url }: { url: string }) {
  if (!url) return null;

  // Couleurs adaptées à la charte Elio
  const params = new URLSearchParams({
    embed_type: "Inline",
    background_color: "FAFAF7",
    text_color: "1E2A3A",
    primary_color: "E8735C",
    hide_gdpr_banner: "1",
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-navy/10 mt-6">
      <iframe
        src={`${url}?${params.toString()}`}
        width="100%"
        height="700"
        frameBorder="0"
        title="Réserver un créneau avec Elio"
        loading="lazy"
      />
    </div>
  );
}
