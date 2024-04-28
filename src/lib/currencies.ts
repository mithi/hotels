import { availableCurrencies } from "@/constants"
import { CurrencyIdentifier, CurrencyInfo } from "@/types"

export const availableCurrenciesRecord: Record<CurrencyIdentifier, CurrencyInfo> =
  availableCurrencies.reduce(
    (acc, curr) => {
      acc[curr.name] = curr
      return acc
    },
    {} as Record<CurrencyIdentifier, CurrencyInfo>
  )

export const priceDisplay = (price: number, currency: CurrencyIdentifier) => {
  const currencySymbol = availableCurrenciesRecord[currency].symbol

  /*
  Hotel prices in the results page are typically rounded
    - Currencies like USD, SGD, CNY are rounded to their nearest dollar. E.g. USD 100.21 is displayed as USD 100
    - Currencies like KRW, JPY, IDR are rounded to their nearest 100-dollars. E.g. KRW 300123.22 is displayed as KRW 300,100
  */

  if (["USD", "SGD", "CNY"].includes(currency)) {
    const roundedPrice = Math.round(price * 100) / 100
    return `${currencySymbol} ${roundedPrice.toFixed(2).toLocaleString()}`
  }

  if (["KRW", "JPY", "IDR"].includes(currency)) {
    const roundedPrice = Math.round(price / 100) * 100
    return `${currencySymbol} ${roundedPrice.toLocaleString()}`
  }

  return `${currencySymbol} ${price}`
}
