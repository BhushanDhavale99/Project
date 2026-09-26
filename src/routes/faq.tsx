import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs & Help Center — ParkGrid One" },
      {
        name: "description",
        content:
          "Comprehensive, searchable answers for parking rules, B1-L2 floors, EV charging, bookings, payments, and entry/exit at BKC Mumbai.",
      },
      { property: "og:title", content: "FAQs & Help Center — ParkGrid One" },
      {
        property: "og:description",
        content:
          "Comprehensive, searchable answers for parking rules, B1-L2 floors, EV charging, bookings, payments, and entry/exit at BKC Mumbai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/HelpCenterPage"), "HelpCenterPage"),
});
