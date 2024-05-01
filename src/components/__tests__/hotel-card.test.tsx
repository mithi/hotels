import "@testing-library/jest-dom/vitest"
import { it, describe, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  generateFakeHotelInfo,
  generateFakeText,
  generateRandomNumber,
  getRandomCurrency,
} from "./faker-utils"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import { HotelCard } from "../sections/hotel"
import { computeSavings } from "@/lib/hotels"
import { precisePriceDisplay, priceDisplay } from "@/lib/currencies"

describe("HotelCard", () => {
  const hotelId = generateRandomNumber({ type: "int" })
  const hotelInfo: HotelInfo = generateFakeHotelInfo(hotelId)

  it("Should show hotel name, address, rating, stars, book button", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()
    const { container } = render(<HotelCard currency={currency} {...hotelInfo} />)

    expect(screen.getByRole("heading", { name: hotelInfo.name })).toBeInTheDocument()
    expect(screen.getByText(hotelInfo.address)).toBeInTheDocument()
    expect(screen.getByText(hotelInfo.rating)).toBeInTheDocument()
    const stars = container.querySelectorAll('[data-icon="hotel-star"]')
    expect(stars.length === hotelInfo.stars)
    expect(screen.getByRole("button", { name: /Book/ })).toBeInTheDocument()
  })

  it("Should show no savings, no price, no strike through price when price is unavailable", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()
    render(<HotelCard currency={currency} {...hotelInfo} />)
    expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
    expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
    expect(screen.queryByText("Taxes and Hotel Fees Included")).not.toBeInTheDocument()
    expect(screen.queryByText("Taxes and other fees may apply")).not.toBeInTheDocument()
    expect(screen.queryByTestId("hotel-price-display-simple")).not.toBeInTheDocument()
    expect(screen.getByText(/Rates unavailable/)).toBeInTheDocument()
  })

  it("Should show no savings and no strikethrough price if price exists but there are no competitors", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()
    /** Make sure no more competitive competitor exists given dummy data */
    const priceInfo: HotelPrice = {
      id: hotelInfo.id,
      price: generateRandomNumber({
        options: { min: 1000, max: 20000, fractionDigits: 2 },
      }),
    }
    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
    expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
    expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
    expect(screen.queryByTestId("hotel-price-display-simple")).toBeInTheDocument()
    expect(screen.getByText(priceDisplay(priceInfo.price, currency))).toBeInTheDocument()
  })

  it("Should show no savings and no strikethrough price if there are competitors but all of them are cheaper", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()
    const competitorA = generateFakeText(4)
    const competitorB = generateFakeText(5)

    /** Make sure no more competitive competitor exists given dummy data */
    const priceInfo: HotelPrice = {
      id: hotelInfo.id,
      price: generateRandomNumber({
        options: { min: 1000, max: 20000, fractionDigits: 2 },
      }),
      competitors: {
        [competitorA]: generateRandomNumber({
          options: { min: 100, max: 500, fractionDigits: 2 },
        }),
        [competitorB]: generateRandomNumber({
          options: { min: 10, max: 999, fractionDigits: 2 },
        }),
      },
    }
    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
    expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
    expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
  })

  it("Should show correct savings and strikethrough if a more expensive competitor exists", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()

    const ourPrice = generateRandomNumber({
      options: { min: 100, max: 200, fractionDigits: 2 },
    })

    const mostExpensiveCompetitor = generateFakeText(4)
    const moreExpensiveCompetitor = generateFakeText(5)
    const cheaperCompetitor = generateFakeText(3)

    const mostExpensivePrice = generateRandomNumber({
      options: { min: 500, max: 700, fractionDigits: 2 },
    })
    const moreExpensivePrice = generateRandomNumber({
      options: { min: 300, max: 400, fractionDigits: 2 },
    })
    const cheaperPrice = generateRandomNumber({
      options: { min: 10, max: 99, fractionDigits: 2 },
    })

    const priceInfo: HotelPrice = {
      id: hotelInfo.id,
      price: ourPrice,
      competitors: {
        [moreExpensiveCompetitor]: moreExpensivePrice,
        [cheaperCompetitor]: cheaperPrice,
        [mostExpensiveCompetitor]: mostExpensivePrice,
      },
    }

    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

    const strikethroughNode = screen.queryByTestId("strikethrough-price")
    expect(strikethroughNode).toBeInTheDocument()
    expect(strikethroughNode).toBeTruthy()

    const strikeThroughText = priceDisplay(mostExpensivePrice, currency)
    if (strikethroughNode) {
      expect(within(strikethroughNode).getByText(strikeThroughText)).toBeInTheDocument()
    }

    const savingsNode = screen.queryByTestId("hotel-savings")
    expect(savingsNode).toBeInTheDocument()

    const savings = computeSavings(priceInfo.price, mostExpensivePrice)
    const savingsText = `Save up to ${savings.toFixed(2)}%`

    if (savingsNode) {
      expect(within(savingsNode).getByText(savingsText)).toBeInTheDocument()
    }
  })

  it("Should display competitor rates within results if they exist, order from cheapest to most expensive, also show our rates in the competition list", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()

    const cheapestPrice = generateRandomNumber({
      options: { min: 0, max: 100, fractionDigits: 2 },
    })
    const cheaperPrice = generateRandomNumber({
      options: { min: 101, max: 450, fractionDigits: 2 },
    })
    const ourPrice = generateRandomNumber({
      options: { min: 500, max: 600, fractionDigits: 2 },
    })
    const moreExpensivePrice = generateRandomNumber({
      options: { min: 650, max: 1000, fractionDigits: 2 },
    })
    const mostExpensivePrice = generateRandomNumber({
      options: { min: 1100, max: 5000, fractionDigits: 2 },
    })
    const priceInfo: HotelPrice = {
      id: hotelInfo.id,
      price: ourPrice,
      competitors: {
        mostExpensive: mostExpensivePrice,
        moreExpensive: moreExpensivePrice,
        cheaper: cheaperPrice,
        cheapest: cheapestPrice,
      },
    }

    const orderedPrices = [
      cheapestPrice,
      cheaperPrice,
      priceInfo.price,
      moreExpensivePrice,
      mostExpensivePrice,
    ]
    const orderedProviders = [
      "cheapest",
      "cheaper",
      "Our Price",
      "moreExpensive",
      "mostExpensive",
    ]

    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

    const competitorPricesNode = screen.queryByTestId("hotel-provider-prices")
    expect(competitorPricesNode).toBeInTheDocument()
    expect(competitorPricesNode).toBeTruthy()

    if (competitorPricesNode) {
      const listItems = within(competitorPricesNode).getAllByRole("listitem")
      expect(listItems.length === orderedPrices.length)
      listItems.forEach((listItem, index) => {
        const price = priceDisplay(orderedPrices[index], currency)
        const provider = orderedProviders[index]
        expect(within(listItem).getByText(price)).toBeInTheDocument()
        expect(within(listItem).getByText(provider)).toBeInTheDocument()
      })
    }
  })

  it("Should inform user that taxes and fees are included if so, and provide breakdown on hover, show asterisk beside the price", async () => {
    const currency: CurrencyIdentifier = getRandomCurrency()
    const ourPrice = 5000
    const tax = 200.41
    const hotel_fees = 400.31

    const priceInfo = {
      id: hotelInfo.id,
      price: ourPrice,
      taxes_and_fees: {
        tax,
        hotel_fees,
      },
    }

    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

    const displayPrice = priceDisplay(priceInfo.price, currency)

    const button = screen.getByRole("button", { name: `${displayPrice}*` })
    expect(button).toBeInTheDocument()
    await userEvent.hover(button)

    expect(screen.getByText("*Final price (Total) is rounded")).toBeInTheDocument()
    expect(screen.getByText("Taxes and Hotel Fees Included")).toBeInTheDocument()
    expect(screen.queryByText("Taxes and other fees may apply")).not.toBeInTheDocument()

    const pricebreakdownTableNode = screen.queryByTestId("price-breakdown-table")
    expect(screen.queryByTestId("price-breakdown-table")).toBeInTheDocument()
    expect(pricebreakdownTableNode).toBeTruthy()

    if (pricebreakdownTableNode) {
      // for now there is no standards yet for table queries. See also:
      // https://github.com/testing-library/dom-testing-library/issues/583

      expect(
        within(pricebreakdownTableNode).getByRole("columnheader", { name: "Item" })
      ).toBeInTheDocument()
      expect(
        within(pricebreakdownTableNode).getByRole("columnheader", { name: "Cost" })
      ).toBeInTheDocument()

      const rawPrice =
        priceInfo.price -
        priceInfo.taxes_and_fees.tax -
        priceInfo.taxes_and_fees.hotel_fees

      expect(
        within(pricebreakdownTableNode).getByRole("row", {
          name: `Price ${precisePriceDisplay(rawPrice, currency)}`,
        })
      ).toBeInTheDocument()

      expect(
        within(pricebreakdownTableNode).getByRole("row", {
          name: `Tax ${precisePriceDisplay(priceInfo.taxes_and_fees.tax, currency)}`,
        })
      ).toBeInTheDocument()

      expect(
        within(pricebreakdownTableNode).getByRole("row", {
          name: `Hotel Fees ${precisePriceDisplay(priceInfo.taxes_and_fees.hotel_fees, currency)}`,
        })
      ).toBeInTheDocument()

      expect(
        within(pricebreakdownTableNode).getByRole("row", {
          name: `Total* ${priceDisplay(priceInfo.price, currency)}`,
        })
      ).toBeInTheDocument()
    }
  })

  it("Should inform users that taxes and fees may apply if no tax and fees information exists", () => {
    const currency: CurrencyIdentifier = getRandomCurrency()

    const priceInfo = {
      id: hotelInfo.id,
      price: generateRandomNumber({
        options: { min: 1000, max: 20000, fractionDigits: 2 },
      }),
    }

    render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

    const displayPrice = priceDisplay(priceInfo.price, currency)
    expect(screen.queryByTestId("hotel-price-display-simple")).toBeInTheDocument()
    expect(screen.getByText(priceDisplay(priceInfo.price, currency))).toBeInTheDocument()
    expect(screen.getByText("Taxes and other fees may apply")).toBeInTheDocument()
    expect(screen.queryByText("Taxes and Hotel Fees Included")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: `${displayPrice}*` })
    ).not.toBeInTheDocument()
  })
})
