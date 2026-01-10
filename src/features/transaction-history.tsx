import { format } from 'date-fns'
import { ArrowDownIcon, ArrowUpIcon, HistoryIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { usePortfolioStore } from '@/lib/portfolio-store'

export function TransactionHistory() {
  const transactions = usePortfolioStore((state) => state.transactions)

  const totalBuys = transactions.filter((t) => t.type === 'BUY').length
  const totalSells = transactions.filter((t) => t.type === 'SELL').length
  const totalVolume = transactions.reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cyan-500 flex items-center gap-3">
          <HistoryIcon className="w-8 h-8" />
          Transaction History
        </h1>
        <Link
          to="/portfolio"
          className="text-sm text-cyan-600 hover:text-cyan-400 transition-colors"
        >
          ← Back to Portfolio
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            Total Transactions
          </h2>
          <p className="text-2xl font-mono text-cyan-400">
            {transactions.length}
          </p>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            Buy / Sell
          </h2>
          <p className="text-2xl font-mono">
            <span className="text-green-500">{totalBuys}</span>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-red-500">{totalSells}</span>
          </p>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            Total Volume
          </h2>
          <p className="text-2xl font-mono text-white">
            $
            {totalVolume.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="border border-gray-700 rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Date / Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Symbol</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-gray-500" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <HistoryIcon className="w-12 h-12 text-gray-600" />
                    <p className="text-lg">No transactions yet</p>
                    <p className="text-sm">
                      Head to the{' '}
                      <Link
                        to="/market"
                        className="text-cyan-500 hover:underline"
                      >
                        Market
                      </Link>{' '}
                      to start trading!
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isBuy = tx.type === 'BUY'
                return (
                  <tr
                    key={tx.id}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-3 font-mono text-sm text-gray-400">
                      {format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                          isBuy
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}
                      >
                        {isBuy ? (
                          <ArrowDownIcon className="w-3 h-3" />
                        ) : (
                          <ArrowUpIcon className="w-3 h-3" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-400">
                      {tx.symbol}
                    </td>
                    <td className="p-3 text-right font-mono">{tx.quantity}</td>
                    <td className="p-3 text-right font-mono">
                      ${tx.price.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-semibold ${
                        isBuy ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {isBuy ? '-' : '+'}$
                      {tx.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Showing all {transactions.length} transaction
          {transactions.length !== 1 ? 's' : ''} • Most recent first
        </p>
      )}
    </div>
  )
}
