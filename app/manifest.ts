import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Balu Restobar",
    short_name: "Balu",
    description: "El sabor que reúne amigos — Restobar premium en Puerto Montt",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#c9a227",
    orientation: "portrait-primary",
    categories: ["food", "restaurant"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
