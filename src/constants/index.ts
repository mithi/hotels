import { CurrencyInfo } from "@/types"

export const availableCurrencies: CurrencyInfo[] = [
  { symbol: "₩", name: "KRW", description: "South Korean Won" },
  { symbol: "¥", name: "CNY", description: "Chinese Yuan" },
  { symbol: "S$", name: "SGD", description: "Singaporean Dollar" },
  { symbol: "US$", name: "USD", description: "U.S. Dollar" },
]

export const HOTEL_URL = "https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo"
export const PRICE_URL = "https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1"

export const LOCAL_STORAGE_CURRENCY_KEY = "selected-currency"
