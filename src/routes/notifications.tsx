import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ParkGrid One" },
      { name: "description", content: "Booking, payment, parking session, and charging updates." },
      { property: "og:title", content: "Notifications — ParkGrid One" },
      {
        property: "og:description",
        content: "Booking, payment, parking session, and charging updates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/app-pages"), "NotificationsPage"),
});
