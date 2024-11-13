import { useEffect, useState } from 'react'

/**
 * Fetches live exchange rates from ExchangeRate-API (open access).
 * Docs: https://www.exchangerate-api.com/docs/free
 * Endpoint: https://open.er-api.com/v6/latest/{BASE}
 */
function useCurrencyInfo(currency) {
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const base = String(currency || 'usd').toUpperCase()

    setLoading(true)
    setError('')

    fetch(`https://open.er-api.com/v6/latest/${base}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((payload) => {
        if (!active) return

        if (payload.result !== 'success' || !payload.rates) {
          throw new Error(payload['error-type'] || 'Unable to load exchange rates')
        }

        const normalized = Object.fromEntries(
          Object.entries(payload.rates).map(([code, rate]) => [
            code.toLowerCase(),
            rate,
          ]),
        )

        setRates(normalized)
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setRates({})
        setError(err.message || 'Failed to fetch currency rates')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [currency])

  return { rates, loading, error }
}

export default useCurrencyInfo
