"use client";

import { useState } from "react";
import CalendlyWidget from "./CalendlyWidget";

const SECTEURS = [
  "Propreté / Facility management",
  "Logistique",
  "Hôtellerie / Restauration",
  "Retail",
  "Automobile",
  "EHPAD",
  "Autre",
];

type FormData = {
  nom: string;
  societe: string;
  email: string;
  telephone: string;
  secteur: string;
  surface: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "loading" | "success" | "error";

function inputBase(hasError: boolean) {
  const base =
    "w-full px-4 py-3 rounded-xl border bg-white text-navy placeholder-navy/30 text-base focus:outline-none focus:ring-2 transition-all min-h-[48px]";
  return hasError
    ? `${base} border-coral ring-1 ring-coral`
    : `${base} border-navy/20 focus:ring-coral/40 focus:border-coral/40`;
}

export default function LeadForm({ calendlyUrl }: { calendlyUrl: string }) {
  const [form, setForm] = useState<FormData>({
    nom: "",
    societe: "",
    email: "",
    telephone: "",
    secteur: "",
    surface: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function set(field: keyof FormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Efface l'erreur du champ dès que l'utilisateur tape
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.societe.trim()) e.societe = "Requis";
    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      e.email = "Adresse email invalide";
    }
    const surfaceNum = Number(form.surface);
    if (!form.surface.trim() || isNaN(surfaceNum) || surfaceNum <= 0) {
      e.surface = "Entrez une surface en m²";
    }
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Scroll vers le premier champ en erreur
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "vivatech" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur serveur");
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  /* Ecran de confirmation après soumission réussie */
  if (status === "success") {
    return (
      <div className="space-y-6">
        <div className="bg-coral/10 border border-coral/20 rounded-2xl p-6">
          <p className="text-2xl font-bold text-navy">Merci !</p>
          <p className="mt-2 text-navy/70 text-sm leading-relaxed">
            Votre demande a bien été transmise. Nous vous recontactons sous 24h.
            Vous pouvez aussi réserver un créneau directement ci-dessous.
          </p>
        </div>
        {calendlyUrl && <CalendlyWidget url={calendlyUrl} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Prénom et nom */}
      <div data-error={!!errors.nom}>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Prénom et nom{" "}
          <span className="text-coral" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="text"
          placeholder="Marie Dupont"
          value={form.nom}
          onChange={set("nom")}
          className={inputBase(!!errors.nom)}
          autoComplete="name"
          aria-required="true"
        />
        {errors.nom && (
          <p className="mt-1 text-xs text-coral" role="alert">
            {errors.nom}
          </p>
        )}
      </div>

      {/* Société */}
      <div data-error={!!errors.societe}>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Société{" "}
          <span className="text-coral" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="text"
          placeholder="Mon entreprise"
          value={form.societe}
          onChange={set("societe")}
          className={inputBase(!!errors.societe)}
          autoComplete="organization"
          aria-required="true"
        />
        {errors.societe && (
          <p className="mt-1 text-xs text-coral" role="alert">
            {errors.societe}
          </p>
        )}
      </div>

      {/* Email */}
      <div data-error={!!errors.email}>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Email{" "}
          <span className="text-coral" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="email"
          placeholder="marie@monentreprise.fr"
          value={form.email}
          onChange={set("email")}
          className={inputBase(!!errors.email)}
          autoComplete="email"
          inputMode="email"
          aria-required="true"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-coral" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Téléphone (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Téléphone{" "}
          <span className="text-navy/30 font-normal">(optionnel)</span>
        </label>
        <input
          type="tel"
          placeholder="+33 6 00 00 00 00"
          value={form.telephone}
          onChange={set("telephone")}
          className={inputBase(false)}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      {/* Secteur */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Secteur
        </label>
        <div className="relative">
          <select
            value={form.secteur}
            onChange={set("secteur")}
            className={`${inputBase(false)} appearance-none pr-10`}
          >
            <option value="">Sélectionnez votre secteur</option>
            {SECTEURS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* Chevron personnalisé */}
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Surface */}
      <div data-error={!!errors.surface}>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Surface approximative (m²){" "}
          <span className="text-coral" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="number"
          placeholder="Ex: 2000"
          value={form.surface}
          onChange={set("surface")}
          className={inputBase(!!errors.surface)}
          min="1"
          inputMode="numeric"
          aria-required="true"
        />
        {errors.surface && (
          <p className="mt-1 text-xs text-coral" role="alert">
            {errors.surface}
          </p>
        )}
      </div>

      {/* Message (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1.5">
          Message{" "}
          <span className="text-navy/30 font-normal">(optionnel)</span>
        </label>
        <textarea
          placeholder="Précisions sur votre site, vos besoins..."
          value={form.message}
          onChange={set("message")}
          rows={3}
          className={`${inputBase(false)} resize-none`}
        />
      </div>

      {/* Erreur globale */}
      {status === "error" && (
        <div
          className="bg-coral/10 border border-coral/20 rounded-xl p-4"
          role="alert"
        >
          <p className="text-sm text-coral font-medium">
            Une erreur s&apos;est produite. Contactez-nous directement:{" "}
            <a
              href="mailto:marceau@elio-robot.fr"
              className="underline underline-offset-2"
            >
              marceau@elio-robot.fr
            </a>
          </p>
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="w-full bg-coral text-white text-base font-semibold rounded-2xl min-h-[56px] px-6 disabled:opacity-60 active:opacity-90 transition-opacity mt-2 cursor-pointer"
      >
        {status === "loading" ? "Envoi en cours..." : "Être recontacté"}
      </button>

      <p className="text-xs text-navy/30 text-center">
        Vos données ne sont utilisées qu&apos;à des fins de contact commercial.
      </p>
    </div>
  );
}
