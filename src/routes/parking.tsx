import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/parking")({
  head: () => ({
    meta: [
      { title: "Book a Parking Space — ParkGrid One" },
      {
        name: "description",
        content: "Choose a live parking bay and reserve your space at ParkGrid One.",
      },
      { property: "og:title", content: "Book a Parking Space — ParkGrid One" },
      {
        property: "og:description",
        content: "Choose a live parking bay and reserve your space at ParkGrid One.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/app-pages"), "ParkingPage"),
});
