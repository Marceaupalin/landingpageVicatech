"use client";

import { useState, useRef, useEffect } from "react";

type VideoInfo =
  | { type: "youtube"; id: string }
  | { type: "vimeo"; id: string }
  | { type: "local"; url: string }
  | { type: "none" };

function parseVideo(src: string): VideoInfo {
  if (!src) return { type: "none" };

  // URL YouTube ou ID direct (11 caractères)
  const ytUrl = src.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytUrl) return { type: "youtube", id: ytUrl[1] };
  if (/^[a-zA-Z0-9_-]{11}$/.test(src)) return { type: "youtube", id: src };

  // URL Vimeo ou ID numérique direct
  const vimeoUrl = src.match(/vimeo\.com\/(\d+)/);
  if (vimeoUrl) return { type: "vimeo", id: vimeoUrl[1] };
  if (/^\d+$/.test(src)) return { type: "vimeo", id: src };

  // Fichier local ou URL directe
  return { type: "local", url: src };
}

export default function VideoPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const video = parseVideo(src);

  // Chargement différé: le player ne s'initialise qu'à l'entrée dans le viewport
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

  if (video.type === "none") return null;

  const ytPoster =
    video.type === "youtube"
      ? `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`
      : null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-navy/10"
    >
      {!playing ? (
        /* Poster cliquable avec bouton play */
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label="Lire la vidéo de démonstration Elio"
        >
          {/* Thumbnail YouTube si disponible */}
          {visible && ytPoster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ytPoster}
              alt="Aperçu de la vidéo Elio"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Fond coloré quand pas de thumbnail */}
          {!ytPoster && (
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/80" />
          )}

          {/* Overlay sombre + bouton play coral */}
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
        /* Player actif après tap */
        <>
          {video.type === "youtube" && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&rel=0&modestbranding=1`}
              title="Elio - Démonstration robot"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {video.type === "vimeo" && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://player.vimeo.com/video/${video.id}?autoplay=1&muted=1&color=E8735C`}
              title="Elio - Démonstration robot"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
          {video.type === "local" && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={video.url}
              poster="/video-poster.jpg"
              autoPlay
              muted
              controls
              playsInline
            />
          )}
        </>
      )}
    </div>
  );
}
