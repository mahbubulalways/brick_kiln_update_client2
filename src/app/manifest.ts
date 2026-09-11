import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Brick Management",
    short_name: "Brick Management",
    description: "Brick Kiln Management Software",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#006A4E",
    orientation: "portrait",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
      },

      {
        src: "/screenshot-desktop.png",
        sizes: "1365x768",
        type: "image/png",
        form_factor: "wide",
      },
    ],

  };
}