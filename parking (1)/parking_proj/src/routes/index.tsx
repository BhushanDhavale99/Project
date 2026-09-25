import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/app-pages";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ParkGrid One — Smart Parking in BKC, Mumbai" },
    { name: "description", content: "Reserve secure smart parking with live availability and QR entry at ParkGrid One, BKC Mumbai." },
    { property: "og:title", content: "ParkGrid One — Smart Parking in BKC, Mumbai" },
    { property: "og:description", content: "Reserve secure smart parking with live availability and QR entry at ParkGrid One, BKC Mumbai." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HomePage,
});

