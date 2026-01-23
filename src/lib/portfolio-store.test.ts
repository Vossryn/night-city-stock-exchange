import { beforeEach, describe, expect, it } from 'vitest'

import {
  formatCurrency,
  getHoldingDayReturn,
  getHoldingGainLoss,
  usePortfolioStore,
} from './portfolio-store'

describe('Portfolio Store', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    usePortfolioStore.setState({
      userId: 'test-user',
      cashBalance: 100000,
      holdings: {},
      transactions: [],
    })
  })

  describe('buyStock', () => {
    it('should execute buy order when sufficient cash', () => {
      const store = usePortfolioStore.getState()
      const result = store.buyStock('ARSK', 10, 150)

      expect(result).toBe(true)

      const state = usePortfolioStore.getState()
      expect(state.cashBalance).toBe(98500) // 100000 - (10 * 150)
      expect(state.holdings['ARSK']).toEqual({
        quantity: 10,
        averageCost: 150,
      })
      expect(state.transactions).toHaveLength(1)
      expect(state.transactions[0]).toMatchObject({
        type: 'BUY',
        symbol: 'ARSK',
        quantity: 10,
        price: 150,
        total: 1500,
      })
    })

    it('should reject buy order when insufficient cash', () => {
      // Set low cash balance
      usePortfolioStore.setState({ cashBalance: 100 })

      const store = usePortfolioStore.getState()
      const result = store.buyStock('ARSK', 10, 150)

      expect(result).toBe(false)

      const state = usePortfolioStore.getState()
      expect(state.cashBalance).toBe(100) // Unchanged
      expect(state.holdings['ARSK']).toBeUndefined()
      expect(state.transactions).toHaveLength(0)
    })

    it('should calculate correct average cost for multiple buys', () => {
      const store = usePortfolioStore.getState()

      // First buy: 10 shares @ 100
      store.buyStock('ARSK', 10, 100)
      // Second buy: 10 shares @ 200
      store.buyStock('ARSK', 10, 200)

      const state = usePortfolioStore.getState()
      expect(state.holdings['ARSK']).toEqual({
        quantity: 20,
        averageCost: 150, // (10*100 + 10*200) / 20
      })
    })
  })

  describe('sellStock', () => {
    beforeEach(() => {
      // Set up initial holding
      usePortfolioStore.setState({
        cashBalance: 50000,
        holdings: {
          ARSK: { quantity: 20, averageCost: 100 },
        },
      })
    })

    it('should execute sell order when sufficient shares', () => {
      const store = usePortfolioStore.getState()
      const result = store.sellStock('ARSK', 10, 150)

      expect(result).toBe(true)

      const state = usePortfolioStore.getState()
      expect(state.cashBalance).toBe(51500) // 50000 + (10 * 150)
      expect(state.holdings['ARSK']).toEqual({
        quantity: 10,
        averageCost: 100, // Average cost unchanged
      })
      expect(state.transactions).toHaveLength(1)
      expect(state.transactions[0]).toMatchObject({
        type: 'SELL',
        symbol: 'ARSK',
        quantity: 10,
        price: 150,
        total: 1500,
      })
    })

    it('should reject sell order when insufficient shares', () => {
      const store = usePortfolioStore.getState()
      const result = store.sellStock('ARSK', 30, 150) // Only have 20 shares

      expect(result).toBe(false)

      const state = usePortfolioStore.getState()
      expect(state.cashBalance).toBe(50000) // Unchanged
      expect(state.holdings['ARSK'].quantity).toBe(20) // Unchanged
      expect(state.transactions).toHaveLength(0)
    })

    it('should reject sell order for unowned stock', () => {
      const store = usePortfolioStore.getState()
      const result = store.sellStock('MLTC', 10, 150)

      expect(result).toBe(false)

      const state = usePortfolioStore.getState()
      expect(state.transactions).toHaveLength(0)
    })

    it('should remove holding when all shares sold', () => {
      const store = usePortfolioStore.getState()
      store.sellStock('ARSK', 20, 150) // Sell all shares

      const state = usePortfolioStore.getState()
      expect(state.holdings['ARSK']).toBeUndefined()
      expect(state.cashBalance).toBe(53000) // 50000 + (20 * 150)
    })
  })

  describe('getTotalPortfolioValue', () => {
    it('should calculate total value with cash and holdings', () => {
      usePortfolioStore.setState({
        cashBalance: 10000,
        holdings: {
          ARSK: { quantity: 10, averageCost: 100 },
          MLTC: { quantity: 5, averageCost: 200 },
        },
      })

      const store = usePortfolioStore.getState()
      const totalValue = store.getTotalPortfolioValue({
        ARSK: 150, // 10 * 150 = 1500
        MLTC: 250, // 5 * 250 = 1250
      })

      expect(totalValue).toBe(12750) // 10000 + 1500 + 1250
    })

    it('should handle missing prices gracefully', () => {
      usePortfolioStore.setState({
        cashBalance: 10000,
        holdings: {
          ARSK: { quantity: 10, averageCost: 100 },
        },
      })

      const store = usePortfolioStore.getState()
      const totalValue = store.getTotalPortfolioValue({}) // No prices

      expect(totalValue).toBe(10000) // Just cash
    })
  })

  describe('resetPortfolio', () => {
    it('should reset to starting values while keeping userId', () => {
      usePortfolioStore.setState({
        userId: 'keep-this-user',
        cashBalance: 5000,
        holdings: { ARSK: { quantity: 10, averageCost: 100 } },
        transactions: [
          { id: '1' } as ReturnType<
            typeof usePortfolioStore.getState
          >['transactions'][0],
        ],
      })

      usePortfolioStore.getState().resetPortfolio()

      const state = usePortfolioStore.getState()
      expect(state.userId).toBe('keep-this-user')
      expect(state.cashBalance).toBe(100000) // Starting cash
      expect(state.holdings).toEqual({})
      expect(state.transactions).toEqual([])
    })
  })
})

describe('Portfolio Helper Functions', () => {
  describe('formatCurrency', () => {
    it('should format with cyberpunk eurodollar symbol', () => {
      expect(formatCurrency(1000)).toBe('€$1,000')
      expect(formatCurrency(1500000)).toBe('€$1,500,000')
    })

    it('should round to whole numbers', () => {
      expect(formatCurrency(1234.56)).toBe('€$1,235')
    })
  })

  describe('getHoldingGainLoss', () => {
    it('should calculate gain correctly', () => {
      const holding = { quantity: 10, averageCost: 100 }
      const result = getHoldingGainLoss(holding, 150)

      expect(result.totalCost).toBe(1000) // 10 * 100
      expect(result.totalValue).toBe(1500) // 10 * 150
      expect(result.gainLoss).toBe(500) // 1500 - 1000
      expect(result.gainLossPercent).toBe(50) // 50% gain
    })

    it('should calculate loss correctly', () => {
      const holding = { quantity: 10, averageCost: 100 }
      const result = getHoldingGainLoss(holding, 80)

      expect(result.gainLoss).toBe(-200) // 800 - 1000
      expect(result.gainLossPercent).toBe(-20) // 20% loss
    })
  })

  describe('getHoldingDayReturn', () => {
    it('should calculate day return correctly', () => {
      const holding = { quantity: 10, averageCost: 100 }
      const result = getHoldingDayReturn(holding, 110, 100)

      expect(result.dayReturn).toBe(100) // (10 * 110) - (10 * 100)
      expect(result.dayReturnPercent).toBe(10) // 10%
    })

    it('should return zero when no day start price', () => {
      const holding = { quantity: 10, averageCost: 100 }
      const result = getHoldingDayReturn(holding, 110, undefined)

      expect(result.dayReturn).toBe(0)
      expect(result.dayReturnPercent).toBe(0)
    })
  })
})
