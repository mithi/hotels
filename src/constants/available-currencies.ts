import { CurrencyIdentifier, CurrencyInfo } from "@/types"

export const availableCurrencies: CurrencyInfo[] = [
  { symbol: "₩", name: "KRW", description: "South Korean Won" },
  { symbol: "¥", name: "CNY", description: "Chinese Yuan" },
  { symbol: "S$", name: "SGD", description: "Singaporean Dollar" },
  { symbol: "US$", name: "USD", description: "U.S. Dollar" },
]

export const availableCurrenciesRecord: Record<CurrencyIdentifier, CurrencyInfo> =
  availableCurrencies.reduce(
    (acc, curr) => {
      acc[curr.name] = curr
      return acc
    },
    {} as Record<CurrencyIdentifier, CurrencyInfo>
  )
