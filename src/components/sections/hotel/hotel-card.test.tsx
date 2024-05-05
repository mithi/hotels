import "@testing-library/jest-dom/vitest"
import { it, describe, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  generateFakeHotelInfo,
  generateFakeText,
  generateRandomNumber,
  getRandomCurrency,
} from "../../__tests__/faker-utils"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import { HotelCard } from "."
import { computeSavings } from "@/lib/hotels"
import { precisePriceDisplay, priceDisplay } from "@/lib/currencies"

describe("HotelCard", () => {
  const hotelId = generateRandomNumber({ type: "int" })
  const hotelInfo: HotelInfo = generateFakeHotelInfo(hotelId)
  const currency: CurrencyIdentifier = getRandomCurrency()

  describe("Displays all required information", () => {
    it("Should display hotel name in the heading", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      expect(screen.getByRole("heading", { name: hotelInfo.name })).toBeInTheDocument()
    })

    it("Should display image", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      const photoName = `Preview Image for ${hotelInfo.name}`
      const photoNode = screen.getByRole("img", { name: photoName })
      expect(photoNode).toBeInTheDocument()
      expect(photoNode).toHaveAttribute("src", hotelInfo.photo)
    })

    it("Should display the booking button", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      expect(screen.getByRole("button", { name: /Book/ })).toBeInTheDocument()
    })

    it("Should display address", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      expect(screen.getByText(hotelInfo.address)).toBeInTheDocument()
    })

    it("Should display rating", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      expect(screen.getByText(hotelInfo.rating)).toBeInTheDocument()
    })

    it("Should display correct number of hotel stars", () => {
      render(<HotelCard currency={currency} {...hotelInfo} />)
      const { container } = render(<HotelCard currency={currency} {...hotelInfo} />)
      const stars = container.querySelectorAll('[data-icon="hotel-star"]')
      expect(stars.length).toEqual(hotelInfo.stars)
    })
  })

  describe("Displays correct information when price is unavailable", () => {
    it("Should inform user that rates are unavailable", () => {
      render(<HotelCard currency={currency} {...hotelInfo} priceInfo={undefined} />)
      expect(screen.getByText(/Rates unavailable/)).toBeInTheDocument()
    })

    it("Should NOT have strike-through price", () => {
      render(<HotelCard currency={currency} {...hotelInfo} priceInfo={undefined} />)
      expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
    })

    it("Should NOT have hotel savings", () => {
      render(<HotelCard currency={currency} {...hotelInfo} priceInfo={undefined} />)
      expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
    })

    it("Should NOT price since it's unavailable", () => {
      render(<HotelCard currency={currency} {...hotelInfo} priceInfo={undefined} />)
      expect(screen.queryByTestId("hotel-price-display-simple")).not.toBeInTheDocument()
    })

    it("Should NOT inapplicable price related information such as if price is fees exclusive/inclusive", () => {
      render(<HotelCard currency={currency} {...hotelInfo} priceInfo={undefined} />)
      expect(screen.queryByTestId("other-fees-included")).not.toBeInTheDocument()
      expect(screen.queryByTestId("other-fees-not-included")).not.toBeInTheDocument()
      expect(screen.queryByText("Taxes and Hotel Fees Included")).not.toBeInTheDocument()
      expect(screen.queryByText("Taxes and other fees may apply")).not.toBeInTheDocument()
    })
  })

  describe("Displays correct information given hotel price and fees", () => {
    describe("WITHOUT additional fees information", () => {
      const priceInfo = {
        id: hotelInfo.id,
        price: generateRandomNumber({
          options: { min: 1000, max: 20000, fractionDigits: 2 },
        }),
      }

      it("Should display plain text price without asterisk ", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

        const simplePriceNode = screen.queryByTestId("hotel-price-display-simple")
        expect(simplePriceNode).toBeInTheDocument()
        expect(simplePriceNode).toBeTruthy()

        if (simplePriceNode) {
          const displayPrice = priceDisplay(priceInfo.price, currency)
          expect(within(simplePriceNode).getByText(displayPrice)).toBeInTheDocument()
          expect(
            within(simplePriceNode).queryByText(`${displayPrice}*`)
          ).not.toBeInTheDocument()
        }
      })

      it("Should inform users that taxes and fees may apply", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.getByText("Taxes and other fees may apply")).toBeInTheDocument()
        expect(screen.queryByTestId("other-fees-not-included")).toBeInTheDocument()
      })

      it("Should NOT display that taxes and fees are included", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("other-fees-included")).not.toBeInTheDocument()
        expect(
          screen.queryByText("Taxes and Hotel Fees Included")
        ).not.toBeInTheDocument()
      })

      it("Should NOT have a price within a button component", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)

        const displayPrice = priceDisplay(priceInfo.price, currency)
        expect(screen.queryByRole("button", { name: `${displayPrice}*` }))
      })
    })

    describe("WITH additional fees information", () => {
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

      it("Should have a button which displays the price with asterisk", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        const displayPrice = priceDisplay(priceInfo.price, currency)
        const button = screen.getByRole("button", { name: `${displayPrice}*` })
        expect(button).toBeInTheDocument()
      })

      it("Should display a popover when user hovers on the button that shows price breakdown", async () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        const displayPrice = priceDisplay(priceInfo.price, currency)

        expect(screen.queryByTestId("price-breakdown-table")).not.toBeInTheDocument()
        await userEvent.hover(screen.getByRole("button", { name: `${displayPrice}*` }))

        const pricebreakdownTableNode = screen.queryByTestId("price-breakdown-table")

        expect(pricebreakdownTableNode).toBeInTheDocument()
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

        expect(screen.getByText("*Final price (Total) is rounded")).toBeInTheDocument()
      })

      it("Should inform users that taxes and fees are included", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("other-fees-included")).toBeInTheDocument()
        expect(screen.getByText("Taxes and Hotel Fees Included")).toBeInTheDocument()
      })

      it("Should NOT display that taxes and fees may apply", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(
          screen.queryByText("Taxes and other fees may apply")
        ).not.toBeInTheDocument()
        expect(screen.queryByTestId("other-fees-not-included")).not.toBeInTheDocument()
      })
    })
  })

  describe("Displays correct information given own price and competitors", () => {
    describe("When Many Competitors Exist", () => {
      /* Make sure random prices are generated with no overlap */
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

      /* This is the source of truth given the information above */
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

      it("Should display competitors rates ordered from cheapest to most expensive, with our own rates included in the list", () => {
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
    })

    describe("When No Competitors", () => {
      /** Make sure no more competitive competitor exists given dummy data */
      const priceInfo: HotelPrice = {
        id: hotelInfo.id,
        price: generateRandomNumber({
          options: { min: 1000, max: 20000, fractionDigits: 2 },
        }),
        competitors: undefined,
      }

      it("Should NOT have strikethrough price", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
      })

      it("Should NOT have hotel savings", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
      })
    })

    describe("When All Competitors are Cheaper", () => {
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

      it("Should NOT have hotel savings", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("hotel-savings")).not.toBeInTheDocument()
      })

      it("Should NOT have strikethrough price", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        expect(screen.queryByTestId("strikethrough-price")).not.toBeInTheDocument()
      })
    })

    describe("When More Expensive Competitor Exists", () => {
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

      it("Should display correct savings", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        const savingsNode = screen.queryByTestId("hotel-savings")
        expect(savingsNode).toBeInTheDocument()

        const savings = computeSavings(priceInfo.price, mostExpensivePrice)
        const savingsText = `Save up to ${savings.toFixed(2)}%`

        if (savingsNode) {
          expect(within(savingsNode).getByText(savingsText)).toBeInTheDocument()
        }
      })

      it("Should display strikethrough price of the most expensive competitor", () => {
        render(<HotelCard currency={currency} {...hotelInfo} priceInfo={priceInfo} />)
        const strikethroughNode = screen.queryByTestId("strikethrough-price")
        expect(strikethroughNode).toBeInTheDocument()
        expect(strikethroughNode).toBeTruthy()

        const strikeThroughText = priceDisplay(mostExpensivePrice, currency)
        if (strikethroughNode) {
          expect(
            within(strikethroughNode).getByText(strikeThroughText)
          ).toBeInTheDocument()
        }
      })
    })
  })
})
