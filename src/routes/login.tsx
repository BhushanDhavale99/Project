import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginPage } from "@/components/LoginPage";
import { replayParkingIntro } from "@/components/effects/OpeningAnimation";

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
        setTimeout(() => {
          replayParkingIntro();
        }, 150);
      }}
    />
  );
}