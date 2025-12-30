import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldAlert, TrendingUp, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { company_data } from "@/lib/company-data";

export const LandingPage = () => {
  // Get a few random companies for the "Hot Picks" section
  const featuredCompanies = company_data.slice(0, 3);

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 py-12 md:py-20 border-b border-cyan-900/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-900/50 text-cyan-400 text-xs md:text-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          MARKET STATUS: VOLATILE
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-cyan-500 to-cyan-900 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          NIGHT CITY <br /> STOCK EXCHANGE
        </h1>
        
        <p className="text-lg md:text-xl text-cyan-400/80 max-w-2xl mx-auto leading-relaxed">
          High Risk. High Reward. No Regrets. <br />
          Trade the biggest corps in Night City. Make your fortune or die trying.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link to="/login">
            <Button 
              size="lg" 
              className="bg-cyan-600 hover:bg-cyan-700 text-black font-bold border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              CONNECT TO NET
            </Button>
          </Link>
          <Link to="/market">
            <Button 
              variant="outline" 
              size="lg"
              className="border-cyan-800 text-cyan-500 hover:bg-cyan-950/50 hover:text-cyan-400 font-mono"
            >
              VIEW MARKET DATA
            </Button>
          </Link>
        </div>
      </section>

      {/* Market Ticker (Simulated) */}
      <section className="w-full overflow-hidden bg-cyan-950/10 border-y border-cyan-900/30 py-3">
          <div className="flex animate-[marquee_60s_linear_infinite] whitespace-nowrap gap-8 hover:pause">
            {[...company_data, ...company_data].map((company, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono">
                <span className="text-cyan-300 font-bold">{company.name.toUpperCase().substring(0, 4)}</span>
                <span className="text-cyan-500">
                  {Math.floor(Math.random() * 1000)}€$
                </span>
                <span className={i % 2 === 0 ? "text-green-500" : "text-red-600"}>
                  {i % 2 === 0 ? "▲" : "▼"} {(Math.random() * 5).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group">
            <TrendingUp className="w-10 h-10 text-cyan-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Real-Time Trading</h3>
            <p className="text-cyan-400/60 text-sm">
              Live market updates. Execute buy and sell orders instantly. Don't blink or you'll miss the dip.
            </p>
          </div>
          
          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group">
            <ShieldAlert className="w-10 h-10 text-cyan-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Corporate Intel</h3>
            <p className="text-cyan-400/60 text-sm">
              Access detailed dossiers on Arasaka, Militech, and more. Knowledge is power. Power is eddies.
            </p>
          </div>

          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group">
            <Zap className="w-10 h-10 text-cyan-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Portfolio Management</h3>
            <p className="text-cyan-400/60 text-sm">
              Track your net worth. Diversify your holdings. Become the richest edgerunner in Night City.
            </p>
          </div>
        </section>

        {/* Featured Companies Preview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-900/30 pb-2">
            <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-2">
              <span className="w-2 h-6 bg-cyan-600 block"></span>
              MARKET MOVERS
            </h2>
            <Link to="/" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {featuredCompanies.map((company) => (
              <div key={company.name} className="flex items-center gap-4 p-4 border border-cyan-900/20 bg-cyan-950/5 hover:bg-cyan-900/10 transition-colors">
                <div className="w-12 h-12 bg-black border border-cyan-900/50 p-1 flex items-center justify-center overflow-hidden">
                  <img src={company.image} alt={company.name} className="w-full h-full object-contain opacity-80 grayscale hover:grayscale-0 transition-all" />
                </div>
                <div>
                  <h4 className="font-bold text-cyan-400">{company.name}</h4>
                  <div className="text-xs text-cyan-500/60">{company.type[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
  );
};

export default LandingPage;
