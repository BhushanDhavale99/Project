import { createFileRoute } from "@tanstack/react-router";
import { ContactSupportPage } from "@/components/ContactSupportPage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Contact Support — ParkGrid One" },
      {
        name: "description",
        content:
          "Submit official support requests, report slot or barrier issues, or connect with our 24/7 on-site facility marshals at BKC Mumbai.",
      },
      { property: "og:title", content: "Contact Support — ParkGrid One" },
      {
        property: "og:description",
        content:
          "Submit official support requests, report slot or barrier issues, or connect with our 24/7 on-site facility marshals at BKC Mumbai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactSupportPage,
});
