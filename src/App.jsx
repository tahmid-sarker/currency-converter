import { useState } from 'react'
import { InputBox } from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import { asset } from './utils/asset'

function App() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('bdt')
  const [convertedAmount, setConvertedAmount] = useState(0)

  const { rates, loading, error } = useCurrencyInfo(from)
  const options = Object.keys(rates).sort((a, b) => a.localeCompare(b))
  const rate = rates[to]

  const swap = () => {
    setFrom(to)
    setTo(from)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
  }

  const convert = (event) => {
    event.preventDefault()
    if (rate == null || Number.isNaN(amount)) return
    setConvertedAmount(Number((amount * rate).toFixed(4)))
  }

  return (
    <div
      className="flex min-h-screen w-full flex-wrap items-center justify-center bg-cover bg-no-repeat px-4 py-8"
      style={{ backgroundImage: `url(${asset("images/image.jpeg")})` }}
    >
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-white/40 bg-white/30 p-5 shadow-lg backdrop-blur-sm">
          <h1 className="mb-1 text-center text-2xl font-semibold text-slate-900">
            Currency Converter
          </h1>
          <p className="mb-4 text-center text-xs text-slate-700">
            Live rates via ExchangeRate-API
          </p>

          <form onSubmit={convert}>
            <div className="mb-1 w-full">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => {
                  setFrom(currency)
                  setConvertedAmount(0)
                }}
                selectCurrency={from}
                onAmountChange={setAmount}
              />
            </div>

            <div className="relative h-0.5 w-full">
              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md border-2 border-white bg-blue-600 px-2 py-0.5 text-white"
                onClick={swap}
              >
                swap
              </button>
            </div>

            <div className="mb-4 mt-1 w-full">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => {
                  setTo(currency)
                  setConvertedAmount(0)
                }}
                selectCurrency={to}
                amountDisable
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!error || rate == null}
              className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Loading rates...'
                : `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
