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
  /*

  From the specs: 
  Hotel prices in the results page are typically rounded
    - Currencies like USD, SGD, CNY are rounded to their nearest dollar. E.g. USD 100.21 is displayed as USD 100
    - Currencies like KRW, JPY, IDR are rounded to their nearest 100-dollars. E.g. KRW 300123.22 is displayed as KRW 300,100

  Note that alternatively we can also use the browser's built-in toLocaleString
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
    toLocaleString(undefined, { style: "currency", currency })

  */

  const currencySymbol = availableCurrenciesRecord[currency].symbol

  const roundedPrice = ["USD", "SGD", "CNY"].includes(currency)
    ? Math.round(price)
    : ["KRW", "JPY", "IDR"].includes(currency)
      ? Math.round(price / 100) * 100
      : price
  return `${currencySymbol} ${roundedPrice.toLocaleString()}`
}
