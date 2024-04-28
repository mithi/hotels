import "@testing-library/jest-dom/vitest"
import { it, describe, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import HotelList from "@/components/sections/hotel-list"
import { HotelInfo, HotelPrice } from "@/types"
import { priceDisplay } from "@/lib/currencies"

const hotelWithoutPrice = {
  id: 6,
  name: "HUNDRED STAY Tokyo Shinjuku",
  rating: 6.7,
  stars: 3,
  address: "2 27 7 Hyakunincho Shinjuku Ku, Japan",
  photo: "https://d2ey9sqrvkqdfs.cloudfront.net/gS3z/i16_m.jpg",
  description: "No Description",
}

const priceWithoutHotelInfo = { id: 8, price: 100 }
const prices: HotelPrice[] = [
  { id: 1, price: 200 },
  { id: 2, price: 300 },
  priceWithoutHotelInfo,
]

const hotels: HotelInfo[] = [
  {
    id: 1,
    name: "Shinagawa Prince Hotel",
    rating: 7.7,
    stars: 4,
    address: "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan",
    photo: "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg",
    description: "No Description",
  },
  hotelWithoutPrice,
  {
    id: 2,
    name: "The Ritz-Carlton, Tokyo",
    rating: 9.1,
    stars: 5,
    address: "107-6245 Tokyo Prefecture, Minato-ku, Akasaka 9-7-1 Tokyo Midtown, Japan",
    photo: "https://d2ey9sqrvkqdfs.cloudfront.net/NXnQ/i12_m.jpg",
    description: "No Description",
  },
]

// ✅ Retrieve hotel information and prices and display as I see fit.
// ✅ If hotel result don't have price, show "Rates Unavailable" and push it to the bottom of list
// ✅ If prices exist without hotel details, do not show.

describe("HotelList", () => {
  const currency = "SGD"
  render(<HotelList currency={currency} hotels={hotels} prices={prices} />)
  const rows = screen.getAllByTestId("hotel-card")
  const bookingCardPrices = screen.getAllByTestId("booking-card-price")

  it("should have the correct number of hotel items", () => {
    expect(rows.length === hotels.length)
  })

  it("should render hotel results in correct order, with hotels with no price at the bottom", () => {
    // https://stackoverflow.com/questions/61148880/how-to-check-elements-are-rendered-with-a-specific-sorting-with-react-testing-li
    const lastRow = rows[rows.length - 1]

    expect(within(rows[0]).getByRole("heading").innerHTML).toMatchInlineSnapshot(
      `"${hotels[0].name}"`
    )
    expect(within(rows[1]).getByRole("heading").innerHTML).toMatchInlineSnapshot(
      `"${hotels[2].name}"`
    )
    expect(within(lastRow).getByRole("heading").innerHTML).toMatchInlineSnapshot(
      `"${hotelWithoutPrice.name}"`
    )
    expect(within(lastRow).getByText(/Rates unavailable/)).toBeTruthy()
  })

  it("If prices exist without hotel details, do not show", () => {
    const price = priceDisplay(priceWithoutHotelInfo.price, currency)
    bookingCardPrices.forEach(row => {
      expect(within(row).queryByText(price)).toBeNull()
    })
  })
})
