import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginPage } from "@/components/LoginPage";

/** Inline replay helper — prevents eagerly loading the 24 KB OpeningAnimation bundle */
function replayParkingIntro() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("parkgrid_seen_intro");
    window.dispatchEvent(new CustomEvent("replay-parking-intro"));
  }
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ParkGrid One" },
      { name: "description", content: "Sign in or create your ParkGrid One account." },
      { property: "og:title", content: "Sign In — ParkGrid One" },
      { property: "og:description", content: "Sign in or create your ParkGrid One account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteLoginComponent,
});

function RouteLoginComponent() {
  const navigate = useNavigate();
  return (
    <LoginPage
      standalone
      onLoginSuccess={() => {
        sessionStorage.setItem("parkgrid_authenticated", "true");
        sessionStorage.removeItem("parkgrid_seen_intro");
        navigate({ to: "/" });
        // No setTimeout — OpeningAnimation picks up the CustomEvent once it mounts.
        replayParkingIntro();
      }}
    />
  );
}
