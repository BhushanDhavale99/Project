import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — ParkGrid One" },
      { name: "description", content: "Review your parking details and complete secure payment." },
      { property: "og:title", content: "Secure Checkout — ParkGrid One" },
      {
        property: "og:description",
        content: "Review your parking details and complete secure payment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/app-pages"), "CheckoutPage"),
});
