import { jsxs, jsx } from 'react/jsx-runtime';
import { u as useTheme } from './ssr.mjs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Sun, Moon } from 'lucide-react';
import '@tanstack/react-router';
import 'react';
import '@tanstack/history';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import '@tanstack/router-core/ssr/server';
import 'node:async_hooks';
import 'tiny-invariant';
import '@tanstack/react-router/ssr/server';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-foreground underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function ModeToggle() {
  const { setTheme } = useTheme();
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", children: [
      /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" }),
      /* @__PURE__ */ jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setTheme("light"), children: "Light" }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setTheme("dark"), children: "Dark" }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setTheme("system"), children: "System" })
    ] })
  ] });
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const SplitComponent = function Home() {
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-svh flex flex-col items-center bg-background text-foreground px-2 md:px-4 py-8 md:py-16 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "pointer-events-none fixed inset-0 z-0", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 -translate-x-1/2 blur-2xl opacity-60 w-[80vw] h-64 bg-gradient-to-r from-primary/70 via-accent/60 to-pink-500/40 rounded-full animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 bottom-0 w-48 h-48 bg-[oklch(77.2%_0.18_110.2)/.5] rounded-full blur-3xl animate-spin-slow" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4 z-10", children: /* @__PURE__ */ jsx(ModeToggle, {}) }),
    /* @__PURE__ */ jsxs("section", { className: "relative z-10 w-full max-w-3xl flex flex-col items-center gap-6 text-center py-8 md:py-16", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-7xl font-extrabold tracking-tight drop-shadow-cyberpunk-glow bg-gradient-to-br from-primary via-accent to-pink-500 bg-clip-text text-transparent animate-fade-in", children: "Night City Stock Exchange" }),
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-2xl text-accent-foreground/90 max-w-2xl font-medium animate-fade-in delay-100", children: [
        "The ultimate cyberpunk trading playground. Buy, sell, and strategize in a world of neon, risk, and opportunity. ",
        /* @__PURE__ */ jsx("span", { className: "text-primary font-bold", children: "No real money. Just pure Night City chaos." })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "lg", className: "mt-4 animate-pulse shadow-cyberpunk-glow text-lg px-8 py-4", children: "Enter the Exchange" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center mt-4 animate-fade-in delay-200", children: [
        /* @__PURE__ */ jsx(Badge, { className: "bg-[oklch(97.5%_0.29_105.7)] text-black font-bold", children: "Neon Yellow" }),
        /* @__PURE__ */ jsx(Badge, { className: "bg-[oklch(77.6%_0.18_217.7)] text-white", children: "Electric Blue" }),
        /* @__PURE__ */ jsx(Badge, { className: "bg-[oklch(54.6%_0.22_19.7)] text-white", children: "Hot Pink" }),
        /* @__PURE__ */ jsx(Badge, { className: "bg-[oklch(77.2%_0.18_110.2)] text-black", children: "Acid Green" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative z-10 w-full max-w-4xl flex flex-wrap justify-center gap-4 my-8 animate-fade-in delay-300", children: [
      /* @__PURE__ */ jsx(Badge, { className: "bg-gradient-to-r from-primary to-accent text-black text-base px-4 py-2 shadow-cyberpunk-glow", children: "Real-time Market Events" }),
      /* @__PURE__ */ jsx(Badge, { className: "bg-gradient-to-r from-pink-500 to-acid-green text-white text-base px-4 py-2 shadow-cyberpunk-glow", children: "Lore-driven Stocks" }),
      /* @__PURE__ */ jsx(Badge, { className: "bg-gradient-to-r from-deep-purple to-electric-blue text-white text-base px-4 py-2 shadow-cyberpunk-glow", children: "Leaderboards & Challenges" }),
      /* @__PURE__ */ jsx(Badge, { className: "bg-gradient-to-r from-cyan-500 to-primary text-black text-base px-4 py-2 shadow-cyberpunk-glow", children: "Mobile-First, Accessible" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8 animate-fade-in delay-400", children: [
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/90 border-primary shadow-cyberpunk-glow h-full", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-primary", children: "Immersive Simulation" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Experience a living, breathing market with dynamic events, corporate wars, and scandals inspired by Night City lore." }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/90 border-accent shadow-cyberpunk-glow h-full", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-accent", children: "Learn & Compete" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Sharpen your trading skills, climb the leaderboards, and tackle thematic challenges\u2014no real money, just pure strategy." }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/90 border-[oklch(54.6%_0.22_19.7)] shadow-cyberpunk-glow h-full", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-[oklch(54.6%_0.22_19.7)]", children: "Cyberpunk Aesthetic" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Neon, grit, and style\u2014every pixel is inspired by the world of Cyberpunk 2077. Fully responsive and accessible." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 my-12 animate-fade-in delay-500", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-extrabold text-accent mb-2", children: "How It Works" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full", children: [
        /* @__PURE__ */ jsxs(Card, { className: "bg-card/80 border-cyan-500 shadow-cyberpunk-glow h-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-cyan-500", children: "1. Register" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Create your account and get a starting balance of eurodollars. No real money, no risk." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "bg-card/80 border-acid-green shadow-cyberpunk-glow h-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-[oklch(77.2%_0.18_110.2)]", children: "2. Trade" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Buy and sell stocks tied to Night City\u2019s corporations, gangs, and assets. Watch the market react in real time." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "bg-card/80 border-pink-500 shadow-cyberpunk-glow h-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-pink-500", children: "3. Dominate" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { children: "Climb the leaderboards, complete challenges, and become a legend of the Night City Stock Exchange." }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "relative z-10 mt-8 w-full max-w-md animate-fade-in delay-600", children: /* @__PURE__ */ jsxs(Card, { className: "bg-card/80 border-accent shadow-cyberpunk-glow", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { children: "NCX: ARASAKA" }),
        /* @__PURE__ */ jsx(Badge, { variant: "default", className: "bg-accent text-accent-foreground", children: "+4.2%" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Arasaka Corp. surges as Night City market opens. ",
          /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: "Buy low, sell high." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", children: "Buy" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Sell" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "relative z-10 w-full max-w-4xl mx-auto mt-16 py-8 text-center text-xs text-muted-foreground border-t border-accent/30", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: "Night City Stock Exchange" }),
        " is a fan project for entertainment and educational purposes only. No real money is involved. Not affiliated with CD Projekt Red."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 mt-2", children: [
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Terms of Service" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Contact" })
      ] })
    ] })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=index-BS3bLI3Q.mjs.map
