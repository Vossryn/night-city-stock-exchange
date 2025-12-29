import { createFileRoute } from "@tanstack/react-router";

import LandingPage from "@/features/landing-page";

export const Route = createFileRoute("/")({ component: App });

function App() {
return (
  <LandingPage />
);
}
