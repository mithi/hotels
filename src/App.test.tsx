import "@testing-library/jest-dom/vitest"
import { vi, it, describe, expect, beforeAll, afterEach, afterAll } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { HOTEL_URL, LOCAL_STORAGE_CURRENCY_KEY, PRICE_URL } from "./constants"
import App from "./App"
import userEvent from "@testing-library/user-event"
import { currencyItemSelectionDisplay } from "./lib/currencies"
import { getRandomItem } from "./components/__tests__/faker-utils"
import { CurrencyIdentifier } from "./types"

// Need this to test radix ui select component
// https://github.com/joaom00/radix-select-vitest/blob/main/src/Select.test.tsx
class MockPointerEvent extends Event {
  button: number
  ctrlKey: boolean
  pointerType: string

  constructor(type: string, props: PointerEventInit) {
    super(type, props)
    this.button = props.button || 0
    this.ctrlKey = props.ctrlKey || false
    this.pointerType = props.pointerType || "mouse"
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.PointerEvent = MockPointerEvent as any
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()

// Mock local storage see also:
// https://robertmarshall.dev/blog/how-to-mock-local-storage-in-jest-tests/
const localStorageMock = (function () {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key]
    },

    setItem(key: string, value: string) {
      store[key] = value
      vi.fn()
    },

    clear() {
      store = {}
    },

    removeItem(key: string) {
      delete store[key]
    },

    getAll() {
      return store
    },
  }
})()

Object.defineProperty(window, "localStorage", { value: localStorageMock })

const server = setupServer(
  http.get(HOTEL_URL, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Shinagawa Prince Hotel",
        rating: 7.7,
        stars: 4,
        address: "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan",
        photo: "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg",
        description: "No Description",
      },
    ])
  }),
  http.get(`${PRICE_URL}/USD`, () => {
    return HttpResponse.json([
      {
        id: 1,
        price: 120,
        competitors: {
          "Booking.com": 125,
          "Hotels.com": 121,
          "Expedia": 120,
          "getaroom": 140,
          "AMOMA.com": 132.77,
        },
      },
    ])
  }),
  http.get(`${PRICE_URL}/CNY`, () => {
    return HttpResponse.json([
      {
        id: 1,
        price: 825.94,
        competitors: {
          "Booking.com": 815,
          "Hotels.com": 817,
          "Expedia": 814,
          "getaroom": 830,
          "AMOMA.com": 900,
        },
      },
    ])
  }),
  http.get(`${PRICE_URL}/SGD`, () => {
    return HttpResponse.json([
      {
        id: 1,
        price: 164,
        competitors: {
          Traveloka: 190,
          Expedia: 163,
        },
        taxes_and_fees: {
          tax: 13.12,
          hotel_fees: 16.4,
        },
      },
    ])
  }),
  http.get(`${PRICE_URL}/KRW`, () => {
    return HttpResponse.json([
      {
        id: 1,
        price: 134434.8,
        competitors: {
          "Booking.com": 135154.89,
          "Hotels.com": 135486.56,
          "Expedia": 134989.05,
          "getaroom": 137642.4,
          "AMOMA.com": 149250.8,
        },
      },
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("App", () => {
  it("Default currency to USD if no currency was last selected", async () => {
    window.localStorage.clear()
    render(<App />)
    const currencySelect = screen.getByRole("combobox", { name: "currency-select" })
    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).toBeUndefined()
    await waitFor(() => {
      expect(currencySelect).not.toBeDisabled()
    })

    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).toBeUndefined()
    expect(currencySelect).toBeInTheDocument()
    expect(
      within(currencySelect).getByText(currencyItemSelectionDisplay("USD"))
    ).toBeInTheDocument()
  })

  it("Allow users to switch currencies and Refreshing the page should show the last currency selected", async () => {
    const localStorageSetItemSpy = vi.spyOn(localStorage, "setItem")
    const user = userEvent.setup()

    window.localStorage.clear()
    const firstApp = render(<App key="first" />)

    const trigger = screen.getByRole("combobox", { name: "currency-select" })
    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).toBeUndefined()

    await waitFor(() => {
      expect(trigger).not.toBeDisabled()
    })

    expect(trigger).toBeInTheDocument()
    await user.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")

    expect(
      screen.getByRole("option", { name: currencyItemSelectionDisplay("USD") })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("option", { name: currencyItemSelectionDisplay("SGD") })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("option", { name: currencyItemSelectionDisplay("CNY") })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("option", { name: currencyItemSelectionDisplay("KRW") })
    ).toBeInTheDocument()

    const randomCurrencyToSelect = getRandomItem([
      "SGD",
      "CNY",
      "KRW",
    ] as CurrencyIdentifier[])

    const displayTextOfSelectedCurrency =
      currencyItemSelectionDisplay(randomCurrencyToSelect)

    await user.click(screen.getByRole("option", { name: displayTextOfSelectedCurrency }))

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(within(trigger).getByText(displayTextOfSelectedCurrency)).toBeInTheDocument()

    expect(localStorageSetItemSpy).toHaveBeenCalled()
    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).not.toBeUndefined()

    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).toEqual(
      `"${randomCurrencyToSelect}"`
    )

    // Unmount and remount app to simulate reloading
    // https://stackoverflow.com/questions/59500697/how-to-test-if-react-state-is-reloaded-from-localstorage
    firstApp.unmount()

    expect(
      screen.queryByRole("combobox", { name: "currency-select" })
    ).not.toBeInTheDocument()

    const container = render(<App key="second" />)

    const newTrigger = container.getByRole("combobox", { name: "currency-select" })

    await waitFor(() => {
      expect(newTrigger).not.toBeDisabled()
    })

    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).not.toBeUndefined()

    expect(window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)).toEqual(
      `"${randomCurrencyToSelect}"`
    )

    expect(
      within(newTrigger).getByText(displayTextOfSelectedCurrency)
    ).toBeInTheDocument()
  })
})
