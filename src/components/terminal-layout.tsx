import React from 'react'

import { cn } from '@/lib/utils'

interface TerminalLayoutProps {
  children: React.ReactNode
  className?: string
}

export const TerminalLayout = ({
  children,
  className,
}: TerminalLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-cyan-500 font-mono p-4 md:p-8 overflow-hidden relative selection:bg-cyan-900 selection:text-white">
      {/* CRT Scanline Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] opacity-20" />

      {/* Screen Glow */}
      <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_100px_rgba(6,182,212,0.1)]" />

      {/* Main Terminal Container */}
      <div
        className={cn(
          'relative z-10 border-2 border-cyan-800/50 bg-black/90 shadow-[0_0_20px_rgba(6,182,212,0.3)] min-h-[calc(100vh-4rem)] flex flex-col',
          className,
        )}
      >
        {/* Terminal Header */}
        <div className="border-b border-cyan-800/50 p-2 flex justify-between items-center bg-cyan-950/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm tracking-widest uppercase text-cyan-400">
              NCSE_NET_ACCESS_V2.77
            </span>
          </div>
          <div className="text-xs text-cyan-600/70 hidden md:block">
            SECURE CONNECTION ESTABLISHED
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 pt-0 md:p-8 md:pt-0 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
          {children}
        </div>

        {/* Terminal Footer */}
        <div className="border-t border-cyan-800/50 p-2 flex justify-between items-center text-xs text-cyan-600/70 bg-cyan-950/10">
          <div>
            STATUS: <span className="text-cyan-400">ONLINE</span>
          </div>
          <div className="flex gap-4">
            <span>MEM: 64TB</span>
            <span>NET: 5G</span>
          </div>
        </div>
      </div>
    </div>
  )
}
