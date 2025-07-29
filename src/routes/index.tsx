import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

function Home() {
  return (
    <div className="relative min-h-svh flex flex-col items-center bg-background text-foreground px-2 md:px-4 py-8 md:py-16 overflow-x-hidden">
      {/* Neon animated background accents */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-2xl opacity-60 w-[80vw] h-64 bg-gradient-to-r from-primary/70 via-accent/60 to-pink-500/40 rounded-full animate-pulse" />
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-[oklch(77.2%_0.18_110.2)/.5] rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Mode toggle in top-right */}
      <div className="absolute right-4 top-4 z-10">
        <ModeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-6 text-center py-8 md:py-16">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight drop-shadow-cyberpunk-glow bg-gradient-to-br from-primary via-accent to-pink-500 bg-clip-text text-transparent animate-fade-in">
          Night City Stock Exchange
        </h1>
        <p className="text-lg md:text-2xl text-accent-foreground/90 max-w-2xl font-medium animate-fade-in delay-100">
          The ultimate cyberpunk trading playground. Buy, sell, and strategize
          in a world of neon, risk, and opportunity.{" "}
          <span className="text-primary font-bold">
            No real money. Just pure Night City chaos.
          </span>
        </p>
        <Button
          size="lg"
          className="mt-4 animate-pulse shadow-cyberpunk-glow text-lg px-8 py-4"
        >
          Enter the Exchange
        </Button>
      </section>

      {/* Cyberpunk Features Bar */}
      <section className="relative z-10 w-full max-w-4xl flex flex-wrap justify-center gap-4 my-8 animate-fade-in delay-300">
        <Badge className="bg-gradient-to-r from-primary to-accent text-black text-base px-4 py-2 shadow-cyberpunk-glow">
          Real-time Market Events
        </Badge>
        <Badge className="bg-gradient-to-r from-pink-500 to-acid-green text-white text-base px-4 py-2 shadow-cyberpunk-glow">
          Lore-driven Stocks
        </Badge>
        <Badge className="bg-gradient-to-r from-cyan-500 to-primary text-black text-base px-4 py-2 shadow-cyberpunk-glow">
          Mobile-First, Accessible
        </Badge>
      </section>

      {/* Why NCX Section */}
      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8 animate-fade-in delay-400">
        <Card className="bg-card/90 border-primary shadow-cyberpunk-glow h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Immersive Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Experience a living, breathing market with dynamic events,
              corporate wars, and scandals inspired by Night City lore.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-card/90 border-accent shadow-cyberpunk-glow h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-accent">
              Learn & Compete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Sharpen your trading skills, climb the leaderboards, and tackle
              thematic challenges—no real money, just pure strategy.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-card/90 border-[oklch(54.6%_0.22_19.7)] shadow-cyberpunk-glow h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[oklch(54.6%_0.22_19.7)]">
              Cyberpunk Aesthetic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Neon, grit, and style—every pixel is inspired by the world of
              Cyberpunk 2077. Fully responsive and accessible.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 my-12 animate-fade-in delay-500">
        <h2 className="text-2xl md:text-3xl font-extrabold text-accent mb-2">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="bg-card/80 border-cyan-500 shadow-cyberpunk-glow h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-cyan-500">
                1. Register
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create your account and get a starting balance of eurodollars.
                No real money, no risk.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-acid-green shadow-cyberpunk-glow h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[oklch(77.2%_0.18_110.2)]">
                2. Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Buy and sell stocks tied to Night City’s corporations, gangs,
                and assets. Watch the market react in real time.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-pink-500 shadow-cyberpunk-glow h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-pink-500">
                3. Dominate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Climb the leaderboards, complete challenges, and become a legend
                of the Night City Stock Exchange.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sample Market Card Example */}
      <section className="relative z-10 mt-8 w-full max-w-md animate-fade-in delay-600">
        <Card className="bg-card/80 border-accent shadow-cyberpunk-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span>NCX: ARASAKA</span>
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground"
              >
                +4.2%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Arasaka Corp. surges as Night City market opens.{" "}
              <span className="text-primary font-semibold">
                Buy low, sell high.
              </span>
            </CardDescription>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary">
                Buy
              </Button>
              <Button size="sm" variant="outline">
                Sell
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto mt-16 py-8 text-center text-xs text-muted-foreground border-t border-accent/30">
        <div className="mb-2">
          <span className="font-bold text-primary">
            Night City Stock Exchange
          </span>{" "}
          is a fan project for entertainment and educational purposes only. No
          real money is involved. Not affiliated with CD Projekt Red.
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
