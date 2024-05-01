import "@testing-library/jest-dom/vitest"
import { it, describe, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import HotelList from "@/components/sections/hotel-list"
import { HotelInfo, HotelPrice } from "@/types"
import { priceDisplay } from "@/lib/currencies"
import {
  generateFakeHotelInfo,
  generateRandomNumber,
  getRandomCurrency,
} from "./faker-utils"

describe("HotelList", () => {
  /* make sure ids wont overlap */
  const hotelWithoutPriceId = generateRandomNumber({
    options: { min: 100, max: 150 },
    type: "int",
  })
  const firstHotelId = generateRandomNumber({
    options: { min: 151, max: 200 },
    type: "int",
  })
  const secondHotelId = generateRandomNumber({
    options: { min: 201, max: 3000 },
    type: "int",
  })
  const priceWithoutHotelInfoId = generateRandomNumber({
    options: { min: 3001, max: 4000 },
    type: "int",
  })

  const hotelWithoutPrice = generateFakeHotelInfo(hotelWithoutPriceId)

  const hotels: HotelInfo[] = [
    generateFakeHotelInfo(firstHotelId),
    hotelWithoutPrice,
    generateFakeHotelInfo(secondHotelId),
  ]

  /* Make sure prices wont overlap */
  const priceWithoutHotelInfo = {
    id: priceWithoutHotelInfoId,
    price: generateRandomNumber({ options: { min: 100, max: 1000 } }),
  }

  const prices: HotelPrice[] = [
    {
      id: secondHotelId,
      price: generateRandomNumber({ options: { min: 1001, max: 10000 } }),
    },
    priceWithoutHotelInfo,
    {
      id: firstHotelId,
      price: generateRandomNumber({ options: { min: 10001, max: 100000 } }),
    },
  ]

  const currency = getRandomCurrency()

  it("should have the correct number of hotel items", () => {
    render(<HotelList currency={currency} hotels={hotels} prices={prices} />)
    const rows = screen.getAllByTestId("hotel-card")
    expect(rows.length === hotels.length)
  })

  it("should render hotel results in correct order, with hotels with no price at the bottom", () => {
    // https://stackoverflow.com/questions/61148880/how-to-check-elements-are-rendered-with-a-specific-sorting-with-react-testing-li
    render(<HotelList currency={currency} hotels={hotels} prices={prices} />)
    const rows = screen.getAllByTestId("hotel-card")
    const lastRow = rows[rows.length - 1]

    expect(
      within(rows[0]).getByRole("heading", { name: hotels[0].name })
    ).toBeInTheDocument()
    expect(
      within(rows[1]).getByRole("heading", { name: hotels[2].name })
    ).toBeInTheDocument()
    expect(
      within(lastRow).getByRole("heading", { name: hotelWithoutPrice.name })
    ).toBeInTheDocument()
    expect(within(lastRow).getByText(/Rates unavailable/)).toBeInTheDocument()
  })

  it("If prices exist without hotel details, do not show", () => {
    render(<HotelList currency={currency} hotels={hotels} prices={prices} />)
    const bookingCardPrices = screen.getAllByTestId("hotel-price-display-simple")

    const price = priceDisplay(priceWithoutHotelInfo.price, currency)
    bookingCardPrices.forEach(row => {
      expect(within(row).queryByText(price)).not.toBeInTheDocument()
    })
  })
})
