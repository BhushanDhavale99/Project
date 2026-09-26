import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Parking Information & FAQs — ParkGrid One" },
      {
        name: "description",
        content: "Rules, pricing, cancellations, entry guidance, safety, and FAQs at BKC Mumbai.",
      },
      { property: "og:title", content: "Parking Information & FAQs — ParkGrid One" },
      {
        property: "og:description",
        content: "Rules, pricing, cancellations, entry guidance, safety, and FAQs at BKC Mumbai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/HelpCenterPage"), "HelpCenterPage"),
});
