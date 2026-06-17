"use client";

import { useState, useRef, useEffect } from "react";

const TABS = [
  {
    id: "proprete",
    label: "Propreté",
    subtitle: "Nettoyage et lavage autonomes",
    videoId: "fBUd3LGrbX8",
  },
  {
    id: "logistique",
    label: "Logistique",
    subtitle: "AMR pour la manutention et le picking",
    videoId: "RHblO-snwsc",
  },
  {
    id: "hotellerie",
    label: "Hôtellerie",
    subtitle: "Livraison en chambre et au restaurant",
    videoId: "b24OS_03ISs",
  },
  {
    id: "accueil",
    label: "Accueil",
    subtitle: "Réception, guidage et information",
    videoId: "iXXamxae2vg",
  },
  {
    id: "humanoide",
    label: "Humanoïde",
    subtitle: "Polyvalent et adaptable à tout contexte",
    videoId: "A6vH-QyBTIw",
  },
];

export default function VideoTabs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Charge les thumbnails uniquement quand la section entre dans le viewport
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function switchTab(idx: number) {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setPlaying(false); // Réinitialise le player à chaque changement d'onglet
  }

  const current = TABS[activeIdx];
  const posterUrl = `https://img.youtube.com/vi/${current.videoId}/maxresdefault.jpg`;

  return (
    <div ref={wrapperRef}>
      {/* Barre d'onglets — défilement horizontal sur mobile */}
      <div
        className="flex gap-2 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => switchTab(idx)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[36px] cursor-pointer ${
              idx === activeIdx
                ? "bg-coral text-white"
                : "bg-navy/10 text-navy hover:bg-navy/15"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sous-titre de l'onglet actif */}
      <p className="text-xs text-navy/50 mb-3 min-h-[16px]">
        {current.subtitle}
      </p>

      {/* Lecteur vidéo */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-navy/10">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Lire la vidéo: ${current.label}`}
          >
            {/* Thumbnail YouTube (chargée seulement si visible) */}
            {visible && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl}
                alt={`Aperçu vidéo ${current.label}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Overlay + bouton play coral */}
            <div className="absolute inset-0 flex items-center justify-center bg-navy/30 group-hover:bg-navy/40 transition-colors">
              <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                <svg
                  className="w-7 h-7 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${current.videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
            title={`Elio - ${current.label}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
