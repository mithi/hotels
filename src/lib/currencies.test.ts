import "@testing-library/jest-dom/vitest"
import { it, describe, expect } from "vitest"
import { availableCurrenciesRecord, priceDisplay } from "./currencies"
import { CurrencyIdentifier } from "@/types"

describe("priceDisplay function", () => {
  it("Should round down USD to the nearest dollar with the correct currency symbol", () => {
    const currencySymbol = availableCurrenciesRecord.USD.symbol
    const currencyName = availableCurrenciesRecord.USD.name
    expect(priceDisplay(558.91, currencyName)).toEqual(`${currencySymbol} 558`)
    expect(priceDisplay(499.25, currencyName)).toEqual(`${currencySymbol} 499`)
  })

  it("Should round down SGD to the nearest dollar with the correct currency symbol", () => {
    const currencySymbol = availableCurrenciesRecord.SGD.symbol
    const currencyName = availableCurrenciesRecord.SGD.name
    expect(priceDisplay(558.91, currencyName)).toEqual(`${currencySymbol} 558`)
    expect(priceDisplay(499.25, currencyName)).toEqual(`${currencySymbol} 499`)
  })

  it("Should round down CNY to the nearest dollar with the correct currency symbol", () => {
    const currencySymbol = availableCurrenciesRecord.CNY.symbol
    const currencyName = availableCurrenciesRecord.CNY.name
    expect(priceDisplay(558.91, currencyName)).toEqual(`${currencySymbol} 558`)
    expect(priceDisplay(499.25, currencyName)).toEqual(`${currencySymbol} 499`)
  })

  it("Should round down KRW to the nearest hundred dollar with the correct currency symbol", () => {
    const currencySymbol = availableCurrenciesRecord.KRW.symbol
    const currencyName = availableCurrenciesRecord.KRW.name
    expect(priceDisplay(295777, currencyName)).toEqual(`${currencySymbol} 295,700`)
    expect(priceDisplay(295410, currencyName)).toEqual(`${currencySymbol} 295,400`)
  })

  it("Should display raw price and raw currency identifier if the passed in currency identifier argument is not known", () => {
    expect(priceDisplay(141.41, "PHP" as CurrencyIdentifier)).toEqual("PHP 141.41")
  })
})
